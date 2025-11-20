import { lazy, useCallback, useState, useMemo, useRef, useEffect } from "react";
import { TaskType, TaskVariants, TaskVariantType } from "../../utils/constants";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { useBoardsStore } from "../../store/boards.store";
import { useAuth } from "../../context/auth.context";
import "./task.styles.css";

const Subtask = lazy(() => import("../subtask"));
const Estimation = lazy(() => import("../estimation"));
const Button = lazy(() => import("../button"));
const RemoveIcon = lazy(() => import("../../icons/remove-icon"));
const DoneIcon = lazy(() => import("../../icons/done-icon"));
const InProgressIcon = lazy(() => import("../../icons/in-progress-icon"));
const BacklogIcon = lazy(() => import("../../icons/backlog-icon"));
const TodoIcon = lazy(() => import("../../icons/todo-icon"));

type TaskProps = {
  data: TaskType;
};

type SwitcherConfig = {
  mod: string;
  anchor?: string;
  handler: () => void;
  icon: JSX.Element;
  key: string;
};

// Cache for switcher configurations
const switchersCache = new Map<string, SwitcherConfig[]>();

// Cache for computed task properties
const taskPropertyCache = new Map<string, { titleHeight: number }>();

const getSwitchersConfig = (
  taskType: TaskVariantType,
  changeTaskType: (type: TaskVariantType) => void,
  removeTask: () => void,
): SwitcherConfig[] => {
  const cacheKey = `${taskType}`;

  if (switchersCache.has(cacheKey)) {
    return switchersCache.get(cacheKey)!;
  }

  let result: SwitcherConfig[] = [];
  switch (taskType) {
    case TaskVariants.BACKLOG:
      result = [
        {
          mod: "color todo",
          anchor: "todo",
          handler: () => changeTaskType(TaskVariants.TODO),
          icon: <TodoIcon />,
          key: "todo",
        },
      ];
      break;
    case TaskVariants.TODO:
      result = [
        {
          mod: "color backlog",
          anchor: "backlog",
          handler: () => changeTaskType(TaskVariants.BACKLOG),
          icon: <BacklogIcon />,
          key: "backlog",
        },
        {
          mod: "color inProgress",
          anchor: "inProgress",
          handler: () => changeTaskType(TaskVariants.IN_PROGRESS),
          icon: <InProgressIcon />,
          key: "inProgress",
        },
      ];
      break;
    case TaskVariants.IN_PROGRESS:
      result = [
        {
          mod: "color todo",
          anchor: "todo",
          handler: () => changeTaskType(TaskVariants.TODO),
          icon: <TodoIcon />,
          key: "todo",
        },
        {
          mod: "color done",
          anchor: "done",
          handler: () => changeTaskType(TaskVariants.DONE),
          icon: <DoneIcon />,
          key: "done",
        },
      ];
      break;
    case TaskVariants.DONE:
      result = [
        {
          mod: "color inProgress",
          anchor: "inProgress",
          handler: () => changeTaskType(TaskVariants.IN_PROGRESS),
          icon: <InProgressIcon />,
          key: "inProgress",
        },
        {
          mod: "color delete",
          handler: removeTask,
          icon: <RemoveIcon />,
          key: "delete",
        },
        {
          mod: "color backlog",
          anchor: "backlog",
          handler: () => changeTaskType(TaskVariants.BACKLOG),
          icon: <BacklogIcon />,
          key: "backlog",
        },
      ];
      break;
    default:
      result = [];
  }

  switchersCache.set(cacheKey, result);
  return result;
};

export const Task = ({ data }: TaskProps) => {
  const { updateTask, removeTask: removeTaskFromStore } = useBoardsStore();
  const { currentUser } = useAuth();
  const elementRef = useRef<HTMLHeadingElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(
    data.type === TaskVariants.DONE,
  );

  // Cache computed properties to avoid recomputations
  const cachedTaskProperties = useMemo(() => {
    const cacheKey = `task-${data.id}`;
    if (taskPropertyCache.has(cacheKey)) {
      return taskPropertyCache.get(cacheKey)!;
    }

    const properties = {
      titleHeight: 0,
    };

    taskPropertyCache.set(cacheKey, properties);
    return properties;
  }, [data.id]);

  const [titleHeight, setTitleHeight] = useState<number>(
    cachedTaskProperties.titleHeight,
  );

  useEffect(() => {
    if (elementRef.current) {
      const height = elementRef.current.offsetHeight;
      setTitleHeight(height);

      // Update cache
      const cacheKey = `task-${data.id}`;
      const cachedProperties = taskPropertyCache.get(cacheKey) || {
        titleHeight: 0,
      };
      cachedProperties.titleHeight = height;
      taskPropertyCache.set(cacheKey, cachedProperties);
    }
  }, [data.id]);

  const changeTaskType = useCallback(
    async (taskType: TaskVariantType) => {
      if (!currentUser) return;
      const updatedTask = { ...data, type: taskType };
      await updateTask(data.boardId, updatedTask, currentUser.uid);
    },
    [data, updateTask, currentUser],
  );

  const removeTask = useCallback(async () => {
    if (!currentUser) return;
    await removeTaskFromStore(data.boardId, data.id, currentUser.uid);
  }, [data.id, data.boardId, removeTaskFromStore, currentUser]);

  const switchers = useMemo(
    () => getSwitchersConfig(data.type, changeTaskType, removeTask),
    [data.type, changeTaskType, removeTask],
  );

  const classes = clsx("task", `task--${data.type}`, {
    "task--collapsed": isCollapsed,
  });

  return (
    <li
      className={classes}
      id={data.id}
      style={{ maxHeight: isCollapsed ? titleHeight : 640 }}
    >
      <header className="task__header">
        {data.type !== TaskVariants.DONE ? (
          <Link
            to="/tasks/edit/$taskId"
            params={{ taskId: data.id }}
            search={{ boardId: data.boardId }}
          >
            <h4 ref={elementRef} className="task__title">
              {data.title}
            </h4>
          </Link>
        ) : (
          <h4
            ref={elementRef}
            className="task__title"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {data.title}
          </h4>
        )}
        <div className="task__header-controls">
          {switchers.map((config) => (
            <Button
              key={config.key}
              mod={config.mod}
              href={`#${config.anchor}`}
              onClick={config.handler}
              aria-label={`switch task type to ${config.key}`}
            >
              {config.icon}
            </Button>
          ))}
        </div>
      </header>
      <div className="task__body">
        {data.description && (
          <em className="task__description">{data.description}</em>
        )}
        {data.subtasks.length > 0 && (
          <ul className="task__subtasks">
            {data.subtasks.map((subtask) => (
              <Subtask
                key={subtask.id}
                data={subtask}
                changeSubtaskHandler={async (updatedSubtask) => {
                  if (!currentUser) return;
                  const updatedSubtasks = data.subtasks.map((item) =>
                    item.id === updatedSubtask.id ? updatedSubtask : item,
                  );

                  const updatedTask = { ...data, subtasks: updatedSubtasks };
                  await updateTask(data.boardId, updatedTask, currentUser.uid);
                }}
              />
            ))}
          </ul>
        )}
      </div>
      <footer className="task__footer">
        <Estimation data={data.time} />
      </footer>
    </li>
  );
};
