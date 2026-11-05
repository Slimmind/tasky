import {
  memo,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TaskType, TaskVariants, TaskVariantType } from "../../utils/constants";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { useBoardsStore } from "../../store/boards.store";
import Subtask from "../subtask";
import Estimation from "../estimation";
import Button from "../button";
import RemoveIcon from "../../icons/remove-icon";
import DoneIcon from "../../icons/done-icon";
import InProgressIcon from "../../icons/in-progress-icon";
import BacklogIcon from "../../icons/backlog-icon";
import TodoIcon from "../../icons/todo-icon";
import "./task.styles.css";

type TaskProps = {
  data: TaskType;
};

// target === null означает удаление задания
type Switcher = {
  mod: string;
  target: TaskVariantType | null;
  icon: ReactNode;
};

const toBacklog: Switcher = {
  mod: "color backlog",
  target: TaskVariants.BACKLOG,
  icon: <BacklogIcon />,
};
const toTodo: Switcher = {
  mod: "color todo",
  target: TaskVariants.TODO,
  icon: <TodoIcon />,
};
const toInProgress: Switcher = {
  mod: "color inProgress",
  target: TaskVariants.IN_PROGRESS,
  icon: <InProgressIcon />,
};
const toDone: Switcher = {
  mod: "color done",
  target: TaskVariants.DONE,
  icon: <DoneIcon />,
};
const toRemove: Switcher = {
  mod: "color delete",
  target: null,
  icon: <RemoveIcon />,
};

const SWITCHERS: Record<TaskVariantType, Switcher[]> = {
  [TaskVariants.BACKLOG]: [toTodo],
  [TaskVariants.TODO]: [toBacklog, toInProgress],
  [TaskVariants.IN_PROGRESS]: [toTodo, toDone],
  [TaskVariants.DONE]: [toInProgress, toRemove, toBacklog],
};

const TaskComponent = ({ data }: TaskProps) => {
  const updateTask = useBoardsStore((state) => state.updateTask);
  const removeTaskFromStore = useBoardsStore((state) => state.removeTask);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const isDone = data.type === TaskVariants.DONE;
  const [isCollapsed, setIsCollapsed] = useState(isDone);
  const [titleHeight, setTitleHeight] = useState(0);

  useLayoutEffect(() => {
    setIsCollapsed(data.type === TaskVariants.DONE);
  }, [data.type]);

  useLayoutEffect(() => {
    if (titleRef.current) {
      setTitleHeight(titleRef.current.offsetHeight);
    }
  }, [data.type, data.title]);

  const handleSwitch = (target: TaskVariantType | null) => {
    const saving =
      target === null
        ? removeTaskFromStore(data.boardId, data.id)
        : updateTask(data.boardId, { ...data, type: target });
    saving.catch((error) => console.error("Failed to update the task:", error));
  };

  const toggleSubtask = useCallback(
    (subtaskId: string) => {
      updateTask(data.boardId, {
        ...data,
        subtasks: data.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, checked: !subtask.checked }
            : subtask,
        ),
      }).catch((error) =>
        console.error("Failed to update the subtask:", error),
      );
    },
    [data, updateTask],
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
        {isDone ? (
          <h4
            ref={titleRef}
            className="task__title"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {data.title}
          </h4>
        ) : (
          <Link
            to="/tasks/edit/$taskId"
            params={{ taskId: data.id }}
            search={{ boardId: data.boardId }}
          >
            <h4 ref={titleRef} className="task__title">
              {data.title}
            </h4>
          </Link>
        )}
        <div className="task__header-controls">
          {SWITCHERS[data.type].map((switcher) =>
            switcher.target ? (
              <Button
                key={switcher.target}
                mod={switcher.mod}
                href={`#${switcher.target}`}
                onClick={() => handleSwitch(switcher.target)}
                aria-label={`switch task type to ${switcher.target}`}
              >
                {switcher.icon}
              </Button>
            ) : (
              <Button
                key="delete"
                mod={switcher.mod}
                onClick={() => handleSwitch(null)}
                aria-label="delete task"
              >
                {switcher.icon}
              </Button>
            ),
          )}
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
                onToggle={toggleSubtask}
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

export const Task = memo(TaskComponent);
