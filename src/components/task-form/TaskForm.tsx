import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "@tanstack/react-router";
import { TaskType, SubtaskType } from "../../utils/constants";
import { estimationToMinutes } from "../../utils/estimation-to-minutes";
import { useBoardsStore } from "../../store/boards.store";
import { useAuth } from "../../context/auth.context";
import BackButton from "../back-button";
import Button from "../button";
import Input from "../input";
import NotFound from "../not-found";
import Preloader from "../preloader";
import "./task-form.styles.css";

type TaskFormProps = {
  boardId?: string;
  taskId?: string;
};

const createEmptySubtask = (): SubtaskType => ({
  id: nanoid(),
  value: "",
  checked: false,
});

const withAtLeastOneSubtask = (subtasks: SubtaskType[] = []): SubtaskType[] =>
  subtasks.length ? subtasks : [createEmptySubtask()];

export const TaskForm = ({ boardId, taskId }: TaskFormProps) => {
  const currentBoard = useBoardsStore((state) =>
    state.boards.find((board) => board.id === boardId),
  );
  const isLoading = useBoardsStore((state) => state.isLoading);
  const updateTask = useBoardsStore((state) => state.updateTask);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const currentTask = currentBoard?.tasks?.find((task) => task.id === taskId);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subtasks, setSubtasks] = useState<SubtaskType[]>(() =>
    withAtLeastOneSubtask(),
  );
  const [estimation, setEstimation] = useState<string>("");

  // Заполняем форму один раз: последующие обновления из Firestore не должны
  // затирать то, что пользователь уже ввёл.
  const isInitialized = useRef(false);
  useEffect(() => {
    if (currentTask && !isInitialized.current) {
      isInitialized.current = true;
      setTitle(currentTask.title ?? "");
      setDescription(currentTask.description ?? "");
      setSubtasks(withAtLeastOneSubtask(currentTask.subtasks));
      setEstimation(currentTask.time.estimation);
    }
  }, [currentTask]);

  const handleChange =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter(event.target.value);

  const handleSubtaskChange =
    (index: number) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setSubtasks((prev) =>
        prev.map((subtask, i) =>
          i === index ? { ...subtask, value } : subtask,
        ),
      );
    };

  const addSubtask = () =>
    setSubtasks((prev) => [...prev, createEmptySubtask()]);

  const removeSubtask = (subtaskId: string) =>
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== subtaskId));

  const buildTask = (boardId: string): TaskType => {
    const time = currentTask?.time;
    return {
      isActive: false,
      ...currentTask,
      boardId,
      id: currentTask?.id ?? nanoid(),
      creationDate: currentTask?.creationDate ?? Date.now(),
      type: currentTask?.type ?? "backlog",
      title: title.trim(),
      description: description.trim(),
      subtasks: subtasks
        .map((subtask) => ({ ...subtask, value: subtask.value.trim() }))
        .filter((subtask) => subtask.value),
      time: {
        spentTime: 0,
        leftTime: 0,
        overTime: 0,
        ...time,
        estimation,
        estimationTime: estimationToMinutes(estimation),
      },
    };
  };

  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser || !boardId || !title.trim()) return;

    // Не ждём ответа сервера: локальный snapshot обновит список сразу,
    // а в офлайне промис не завершился бы до появления сети.
    updateTask(boardId, buildTask(boardId)).catch((error) =>
      console.error("Failed to save the task:", error),
    );
    navigate({ to: "/boards/$boardId", params: { boardId } });
  };

  if (isLoading) return <Preloader />;
  if (!currentBoard) return <NotFound message="Проект не найден" />;
  if (taskId && !currentTask) return <NotFound message="Задание не найдено" />;

  return (
    <form onSubmit={submitForm} className="task-form">
      <h3 className="task-form__title">
        {taskId ? "Редактирование задания" : "Создание нового задания"}
      </h3>
      <Input
        id="title"
        value={title}
        onChange={handleChange(setTitle)}
        type="text"
        placeholder="Заголовок..."
        required
      />
      <Input
        id="description"
        value={description}
        onChange={handleChange(setDescription)}
        type="textarea"
        placeholder="Описание..."
      />

      {subtasks.map((field, index) => (
        <Input
          key={field.id}
          id={field.id}
          type="textarea"
          placeholder={`Подзадача-${index + 1}`}
          value={field.value}
          onChange={handleSubtaskChange(index)}
        >
          <Button
            type="button"
            mod={`icon filled ${index === 0 ? "plus" : "minus"}`}
            aria-label={index === 0 ? "add subtask" : "remove subtask"}
            onClick={() =>
              index === 0 ? addSubtask() : removeSubtask(field.id)
            }
          />
        </Input>
      ))}

      <Input
        id="estimation"
        value={estimation}
        onChange={handleChange(setEstimation)}
        type="text"
        placeholder="Время на выполнение: 1w 2d 3h 4m"
        description="Формат: 1w 2d 3h 4m (недели, дни, часы, минуты)"
        pattern="^(\d+w\s?)?(\d+d\s?)?(\d+h\s?)?(\d+m)?$"
      />
      <div className="task-form__controls">
        <BackButton>Отмена</BackButton>
        <Button type="submit" mod="wide">
          {taskId ? "Сохранить" : "Создать"}
        </Button>
      </div>
    </form>
  );
};
