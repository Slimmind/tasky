import { useCallback } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import {
  SubtaskType,
  TaskType,
  TaskVariants,
  TaskVariantType,
} from '../../utils/constants';
import Subtask from '../subtask';
import './task.styles.css';
import Estimation from '../estimation';
import Button from '../button';

type TaskProps = {
  data: TaskType;
};

export const Task = ({ data }: TaskProps) => {
  const { changeTask, deleteTask } = useFirestore();

  console.log('TASK: ', data);

  const updateTask = useCallback(
    (subtask: SubtaskType) => {
      if (data?.subtasks?.length === 0) return;

      const updatedSubtasks = data?.subtasks?.map((item) =>
        item.id === subtask.id ? subtask : item
      );
      const updatedTask = { ...data, subtasks: updatedSubtasks };

      changeTask(data.id, updatedTask);
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

  const switchTaskVariants = (taskType: TaskVariantType) => {
    const switchersConfig = {
      [TaskVariants.BACKLOG]: [
        { mod: 'color todo', handler: () => changeTaskType('todo') },
      ],
      [TaskVariants.TODO]: [
        { mod: 'color backlog', handler: () => changeTaskType('backlog') },
        {
          mod: 'color inProgress',
          handler: () => changeTaskType('inProgress'),
        },
      ],
      [TaskVariants.IN_PROGRESS]: [
        { mod: 'color todo', handler: () => changeTaskType('todo') },
        { mod: 'color done', handler: () => changeTaskType('done') },
      ],
      [TaskVariants.DONE]: [
        {
          mod: 'color inProgress',
          handler: () => changeTaskType('inProgress'),
        },
        { mod: 'color delete', handler: () => deleteTask(data.id) },
        { mod: 'color backlog', handler: () => changeTaskType('backlog') },
      ],
    };

    return switchersConfig[taskType].map((config, index) => (
      <Button key={index} mod={config.mod} onClick={config.handler} aria-label={`switch task type to ${taskType}`}></Button>
    ));
  };

  return (
    <li className={`task task--${data.type}`} id={data.id}>
      <header className='task__header'>
        <h4 className='task__title'>{data.title}</h4>
        <div className='task__header-controls'>
          {switchTaskVariants(data.type)}
        </div>
      </header>
      <div className='task__body'>
        {data.description && (
          <em className='task__description'>{data.description}</em>
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
