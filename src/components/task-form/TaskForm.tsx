import { ChangeEvent, FormEvent, useState, lazy } from 'react';
import { nanoid } from 'nanoid';
import { useFirestore } from '../../contexts/firestore.context';
import { TaskType, SubtaskType } from '../../utils/constants';
import { estimationToMinutes } from '../../utils/estimation-to-minutes';

const Panel = lazy(() => import('../panel'));
const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));

type TaskFormProps = {
  taskId?: string;
  isActive: boolean;
  togglePanel: () => void;
};

export const TaskForm = ({ taskId, isActive, togglePanel }: TaskFormProps) => {
  const { tasks, addTask, changeTask } = useFirestore();

  const currentTask = tasks.find((task: TaskType) => task.id === taskId);
  const initializeFields = (arr: SubtaskType[] = []): SubtaskType[] =>
    arr.length > 0 ? arr : [{ id: nanoid(), value: '', checked: false }];

  const [title, setTitle] = useState<string>(currentTask?.title ?? '');
  const [description, setDescription] = useState<string>(
    currentTask?.description ?? ''
  );
  const [subtasks, setSubtasks] = useState<SubtaskType[]>(
    initializeFields(currentTask?.subtasks)
  );
  const [estimation, setEstimation] = useState<string>('');

  const handleOriginalChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    setField: React.Dispatch<React.SetStateAction<SubtaskType[]>>
  ) => {
    const { value } = event.target;
    setField((prevFields) =>
      prevFields.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const handleEstimationChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;

    setEstimation(value);
  }

  const addField = (
    setField: React.Dispatch<React.SetStateAction<SubtaskType[]>>
  ) => {
    setField((prevFields) => [
      ...prevFields,
      { id: nanoid(), value: '', checked: false },
    ]);
  };

  const removeField = (
    setField: React.Dispatch<React.SetStateAction<SubtaskType[]>>,
    fieldId: string
  ) => {
    setField((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
  };

  const renderSubtaskFields = (
    fields: SubtaskType[],
    setField: React.Dispatch<React.SetStateAction<SubtaskType[]>>,
    placeholder: string,
    inputType: 'text' | 'textarea' = 'text'
  ) =>
    fields.map((field, index) => (
      <Input
        key={field.id}
        id={field.id}
        type={inputType}
        placeholder={
          fields.length > 1 ? `${placeholder}-${index + 1}` : placeholder
        }
        value={field.value}
        onChange={(event) => handleFieldChange(event, index, setField)}
      >
        <Button
          type='button'
          mod={`icon filled ${index === 0 ? 'plus' : 'minus'}`}
          onClick={() =>
            index === 0 ? addField(setField) : removeField(setField, field.id)
          }
        />
      </Input>
    ));

  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    const newItem = buildItem();

    if (taskId) {
      changeTask(taskId, newItem);
    } else {
      addTask(newItem);
      console.log('TASK: ', newItem);
    }

    resetFields();
    togglePanel();
  };

  const checkSubtaskDetails = (arr: SubtaskType[]): SubtaskType[] =>
    arr[0].value ? arr : [];

  const buildItem = (): TaskType => {
    return {
      id: nanoid(),
      type: 'backlog',
      title,
      description,
      subtasks: checkSubtaskDetails(subtasks),
      time: {
        estimation,
        estimationTime: estimationToMinutes(estimation),
        spentTime: 0,
        leftTime: 0,
        overTime: 0
      }
    };
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setSubtasks(initializeFields());
  };

  return (
    <>
      <Button
        mod='icon add'
        onClick={togglePanel}
        aria-label={`${taskId ? 'Edit Task' : 'Add Task'}`}
      />
      <Panel
        isActive={isActive}
        title={`${taskId ? 'Edit task' : 'Create a new task'}`}
      >
        <form onSubmit={submitForm}>
          <Input
            id='title'
            value={title}
            onChange={handleOriginalChange}
            type='text'
            placeholder='Title...'
          />
          <Input
            id='description'
            value={description}
            onChange={handleDescriptionChange}
            type='textarea'
            placeholder='Description...'
          />
          {renderSubtaskFields(subtasks, setSubtasks, 'Subtask', 'textarea')}
          <Input
            id='estimation'
            value={estimation}
            onChange={handleEstimationChange}
            type='text'
            placeholder='Estimation: 1w 2d 3h 4m'
          />

          <Button type='submit' mod='wide'>
            {taskId ? 'Save Changes' : 'Submit'}
          </Button>
        </form>
      </Panel>
    </>
  );
};
