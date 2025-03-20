import { lazy, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import {
  PanelViews,
  SubtaskType,
  TaskType,
  TaskVariants,
  TaskVariantType,
} from '../../utils/constants';
import { useTasks } from '../../context/task.context';
import { usePanel } from '../../context/panel.context';
import './task.styles.css';
import clsx from 'clsx';

const Subtask = lazy(() => import('../subtask'));
const Estimation = lazy(() => import('../estimation'));
const Button = lazy(() => import('../button'));
const RemoveIcon = lazy(() => import('../../icons/remove-icon'));
const DoneIcon = lazy(() => import('../../icons/done-icon'));
const InProgressIcon = lazy(() => import('../../icons/in-progress-icon'));
const BacklogIcon = lazy(() => import('../../icons/backlog-icon'));
const TodoIcon = lazy(() => import('../../icons/todo-icon'));

type TaskProps = {
  data: TaskType;
};

type SwitcherConfig = {
  mod: string;
  anchor?: string;
  handler: () => void;
  icon: JSX.Element;
};

const getSwitchersConfig = (
  taskType: TaskVariantType,
  changeTaskType: (type: TaskVariantType) => void,
  removeTask: () => void
): SwitcherConfig[] => {
  return {
    [TaskVariants.BACKLOG]: [
      {
        mod: 'color todo',
        anchor: 'todo',
        handler: () => changeTaskType('todo'),
        icon: <TodoIcon />,
      },
    ],
    [TaskVariants.TODO]: [
      {
        mod: 'color backlog',
        anchor: 'backlog',
        handler: () => changeTaskType('backlog'),
        icon: <BacklogIcon />,
      },
      {
        mod: 'color inProgress',
        anchor: 'inProgress',
        handler: () => changeTaskType('inProgress'),
        icon: <InProgressIcon />,
      },
    ],
    [TaskVariants.IN_PROGRESS]: [
      {
        mod: 'color todo',
        anchor: 'todo',
        handler: () => changeTaskType('todo'),
        icon: <TodoIcon />,
      },
      {
        mod: 'color done',
        anchor: 'done',
        handler: () => changeTaskType('done'),
        icon: <DoneIcon />,
      },
    ],
    [TaskVariants.DONE]: [
      {
        mod: 'color inProgress',
        anchor: 'inProgress',
        handler: () => changeTaskType('inProgress'),
        icon: <InProgressIcon />,
      },
      {
        mod: 'color delete',
        handler: removeTask,
        icon: <RemoveIcon />,
      },
      {
        mod: 'color backlog',
        anchor: 'backlog',
        handler: () => changeTaskType('backlog'),
        icon: <BacklogIcon />,
      },
    ],
  }[taskType];
};

export const Task = ({ data }: TaskProps) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const { changeTask, removeTask } = useTasks();
  const { setActivePanel } = usePanel();
  const [isCollapsed, setIsCollapsed] = useState(data.type === TaskVariants.DONE);
  const [titleHeight, setTitleHeight] = useState<number>(0);

  useEffect(() => {
    if(elementRef.current) {
      setTitleHeight(elementRef.current.offsetHeight);
    }
  }, []);

  const handleTitleClick = useCallback(() => {
    if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      setActivePanel(PanelViews.EDIT, data.id);
    }
  }, [data.id, setActivePanel, isCollapsed, setIsCollapsed]);

  const updateTask = useCallback(
    (subtask: SubtaskType) => {
      if (data?.subtasks?.length === 0) return;

      const updatedSubtasks = data.subtasks.map((item) =>
        item.id === subtask.id ? subtask : item
      );

      const hasChanged = !updatedSubtasks.every(
        (item, index) => item === data.subtasks[index]
      );

      if (hasChanged) {
        const updatedTask = { ...data, subtasks: updatedSubtasks };
        changeTask(data.id, updatedTask);
      }
    },
    [data, changeTask]
  );

  const changeTaskType = useCallback(
    (taskType: TaskVariantType) => {
      const updatedTask = { ...data, type: taskType };
      changeTask(data.id, updatedTask);
    },
    [data, changeTask]
  );

  const switchers = useMemo(
    () =>
      getSwitchersConfig(data.type, changeTaskType, () => removeTask(data.id)),
    [data.type, changeTaskType, removeTask, data.id]
  );

  const classes = clsx('task', `task--${data.type}`, {
    'task--collapsed': isCollapsed,
  });

  return (
    <li className={classes} id={data.id} style={{maxHeight: isCollapsed ? titleHeight : 640}}>
      <header className='task__header'>
        <h4
          ref={elementRef}
          className='task__title'
          onClick={handleTitleClick}
        >
          {data.title}
        </h4>
        <div className='task__header-controls'>
          {switchers.map((config, index) => (
            <Button
              key={index}
              mod={config.mod}
              href={`#${config.anchor}`}
              onClick={config.handler}
              aria-label={`switch task type to ${data.type}`}
            >
              {config.icon}
            </Button>
          ))}
        </div>
      </header>
      <div className='task__body'>
        {data.description && (
          <em className='task__description' onClick={handleTitleClick}>
            {data.description}
          </em>
        )}
        {data.subtasks.length > 0 && (
          <ul className='task__subtasks'>
            {data.subtasks.map((subtask) => (
              <Subtask
                key={subtask.id}
                data={subtask}
                changeSubtaskHandler={updateTask}
              />
            ))}
          </ul>
        )}
      </div>
      <footer className='task__footer'>
        <Estimation data={data.time} />
      </footer>
    </li>
  );
};
