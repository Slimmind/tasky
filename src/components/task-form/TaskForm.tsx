import { ChangeEvent, FormEvent, useState, useEffect, lazy } from "react";
import { nanoid } from "nanoid";
import { TaskType, SubtaskType } from "../../utils/constants";
import { useTasks } from "../../context/task.context";
import { estimationToMinutes } from "../../utils/estimation-to-minutes";

const Panel = lazy(() => import("../panel"));
const Button = lazy(() => import("../button"));
const Input = lazy(() => import("../input"));

type TaskFormProps = {
  taskId?: string;
  isActive: boolean;
  togglePanel: () => void;
};

export const TaskForm = ({ taskId, isActive, togglePanel }: TaskFormProps) => {
  // alert(taskId);
  const { tasks, addTask, changeTask } = useTasks();
  const currentTask = tasks.find((task) => task.id === taskId);

  const initializeSubtasks = (arr: SubtaskType[] = []): SubtaskType[] =>
    arr.length ? arr : [{ id: nanoid(), value: "", checked: false }];

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subtasks, setSubtasks] = useState<SubtaskType[]>(initializeSubtasks());
  const [estimation, setEstimation] = useState<string>("");

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title ?? '');
      setDescription(currentTask.description ?? '');
      setSubtasks(initializeSubtasks(currentTask.subtasks ?? []));
    }
  }, [currentTask]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setter(event.target.value);

  const handleSubtaskChange = (index: number) => 
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSubtasks((prev) =>
        prev.map((field, i) => (i === index ? { ...field, value: event.target.value } : field))
      );
    };

  const addSubtask = () => {
    setSubtasks((prev) => [...prev, { id: nanoid(), value: "", checked: false }]);
  };

  const removeSubtask = (fieldId: string) => {
    setSubtasks((prev) => prev.filter((field) => field.id !== fieldId));
  };

  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    const newTask = buildTask();

    if (taskId) {
      changeTask(taskId, newTask);
    } else {
      addTask(newTask);
    }
    resetForm();
    togglePanel();
  };

  const buildTask = (): TaskType => ({
    id: nanoid(),
    type: "backlog",
    title,
    description,
    isActive: false,
    subtasks: subtasks[0].value ? subtasks : [],
    time: {
      estimation,
      estimationTime: estimationToMinutes(estimation),
      spentTime: 0,
      leftTime: 0,
      overTime: 0,
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubtasks(initializeSubtasks());
    setEstimation("");
  };

  return (
    <>
      <Button
        mod="icon add"
        onClick={togglePanel}
        aria-label={taskId ? "Edit Task" : "Add Task"}
      />
      <Panel isActive={isActive} title={taskId ? "Edit task" : "Create a new task"}>
        <form onSubmit={submitForm}>
          <Input id="title" value={title} onChange={handleInputChange(setTitle)} type="text" placeholder="Title..." />
          <Input id="description" value={description} onChange={handleInputChange(setDescription)} type="textarea" placeholder="Description..." />

          {subtasks.map((field, index) => (
            <Input
              key={field.id}
              id={field.id}
              type="text"
              placeholder={`Subtask-${index + 1}`}
              value={field.value}
              onChange={handleSubtaskChange(index)}
            >
              <Button type="button" mod={`icon filled ${index === 0 ? "plus" : "minus"}`} onClick={() => (index === 0 ? addSubtask() : removeSubtask(field.id))} />
            </Input>
          ))}

          <Input id="estimation" value={estimation} onChange={handleInputChange(setEstimation)} type="text" placeholder="Estimation: 1w 2d 3h 4m" />

          <Button type="submit" mod="wide">{taskId ? "Save Changes" : "Submit"}</Button>
        </form>
      </Panel>
    </>
  );
};
