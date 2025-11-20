import {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  lazy,
  useCallback,
  memo,
} from "react";
import { nanoid } from "nanoid";
import { TaskType, SubtaskType, BoardType } from "../../utils/constants";
import { estimationToMinutes } from "../../utils/estimation-to-minutes";
import { useBoardsStore } from "../../store/boards.store";
import { useAuth } from "../../context/auth.context";
import { useNavigate } from "@tanstack/react-router";
// import { ErrorMessage } from '../error-message';
import "./task-form.styles.css";

const Button = lazy(() => import("../button"));
const BackButton = lazy(() => import("../back-button"));
const Input = lazy(() => import("../input"));

type TaskFormProps = {
  boardId?: string;
  taskId?: string;
};

// Мемоизированный компонент Input
const MemoizedInput = memo(Input);

export const TaskForm = ({ boardId, taskId }: TaskFormProps) => {
  const boards = useBoardsStore((state) => state.boards);
  const updateTask = useBoardsStore((state) => state.updateTask);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const currentBoard = boards.find((board: BoardType) => board.id === boardId);
  const currentTask = currentBoard?.tasks?.find((task) => task.id === taskId);

  // Ленивая инициализация subtasks
  const initializeSubtasks = useCallback(
    (arr: SubtaskType[] = []): SubtaskType[] =>
      arr.length ? arr : [{ id: nanoid(), value: "", checked: false }],
    [],
  );

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subtasks, setSubtasks] = useState<SubtaskType[]>(() =>
    initializeSubtasks(currentTask?.subtasks),
  );
  const [estimation, setEstimation] = useState<string>("");

  // Инициализация состояния при изменении currentTask
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title ?? "");
      setDescription(currentTask.description ?? "");
      setSubtasks(initializeSubtasks(currentTask.subtasks ?? []));
      setEstimation(currentTask.time.estimation);
    }
  }, [currentTask, initializeSubtasks]);

  // Мемоизированный обработчик изменения input
  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setter(event.target.value),
    [],
  );

  // Мемоизированный обработчик изменения subtask
  const handleSubtaskChange = useCallback(
    (index: number) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSubtasks((prev) =>
          prev.map((field, i) =>
            i === index ? { ...field, value: event.target.value } : field,
          ),
        );
      },
    [],
  );

  // Мемоизированная функция добавления subtask
  const addSubtask = useCallback(() => {
    setSubtasks((prev) => [
      ...prev,
      { id: nanoid(), value: "", checked: false },
    ]);
  }, []);

  // Мемоизированная функция удаления subtask
  const removeSubtask = useCallback((fieldId: string) => {
    setSubtasks((prev) => prev.filter((field) => field.id !== fieldId));
  }, []);

  // Мемоизированная функция отправки формы
  const submitForm = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!currentUser || !boardId) return;

      const newTask = buildTask();
      await updateTask(boardId, newTask, currentUser.uid);

      resetForm();
      navigate({ to: `/boards/${boardId}` });
    },
    [
      title,
      description,
      subtasks,
      estimation,
      taskId,
      currentUser,
      boardId,
      updateTask,
    ],
  );

  // Функция создания задачи
  const buildTask = useCallback(
    (): TaskType => ({
      boardId: boardId || "",
      id: nanoid(),
      creationDate: Date.now(),
      type: currentTask ? currentTask.type : "backlog",
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
    }),
    [title, description, subtasks, estimation],
  );

  // Функция сброса формы
  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setSubtasks(initializeSubtasks());
    setEstimation("");
  }, [initializeSubtasks]);

  return (
    <form onSubmit={submitForm} className="task-form">
      <h3 className="task-form__title">
        {taskId ? "Edit task" : "Create new task"}
      </h3>
      <MemoizedInput
        id="title"
        value={title}
        onChange={handleInputChange(setTitle)}
        type="text"
        placeholder="Заголовок..."
      />
      <MemoizedInput
        id="description"
        value={description}
        onChange={handleInputChange(setDescription)}
        type="textarea"
        placeholder="Описание..."
      />

      {subtasks.map((field, index) => (
        <MemoizedInput
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
        </MemoizedInput>
      ))}

      <MemoizedInput
        id="estimation"
        value={estimation}
        onChange={handleInputChange(setEstimation)}
        type="text"
        placeholder="Время на выполонение: 1w 2d 3h 4m"
        description="Формат: 1w 2d 3h 4m (недели, дни, часы, минуты)"
        pattern="^(\d+w\s?)?(\d+d\s?)?(\d+h\s?)?(\d+m)?$"
      />
      <div className="task-form__controls">
        <BackButton>Отмена</BackButton>
        {taskId ? (
          <Button type="submit" mod="wide">
            Сохранить
          </Button>
        ) : (
          <Button type="submit" mod="wide">
            Создать
          </Button>
        )}
      </div>
    </form>
  );
};
