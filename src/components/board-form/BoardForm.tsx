import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useBoardsStore } from "../../store/boards.store";
import { useAuth } from "../../context/auth.context";
import { getRandomRGB } from "../../utils/get-random-rgb";
import BackButton from "../back-button";
import Button from "../button";
import Input from "../input";
import NotFound from "../not-found";
import Preloader from "../preloader";
import "./board-form.styles.css";

type BoardFormProps = {
  boardId?: string;
};

export const BoardForm = ({ boardId }: BoardFormProps) => {
  const currentBoard = useBoardsStore((state) =>
    state.boards.find((board) => board.id === boardId),
  );
  const isLoading = useBoardsStore((state) => state.isLoading);
  const addBoard = useBoardsStore((state) => state.addBoard);
  const updateBoard = useBoardsStore((state) => state.updateBoard);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Заполняем форму один раз: последующие обновления из Firestore не должны
  // затирать то, что пользователь уже ввёл.
  const isInitialized = useRef(false);
  useEffect(() => {
    if (currentBoard && !isInitialized.current) {
      isInitialized.current = true;
      setTitle(currentBoard.title ?? "");
      setDescription(currentBoard.description ?? "");
    }
  }, [currentBoard]);

  const handleChange =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter(event.target.value);

  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;

    const fields = { title: title.trim(), description: description.trim() };
    if (!fields.title) return;

    const saving = boardId
      ? updateBoard(boardId, fields)
      : addBoard(
          { ...fields, color: getRandomRGB(), tasks: [] },
          currentUser.uid,
        );

    // Не ждём ответа сервера: локальный snapshot обновит список сразу,
    // а в офлайне промис не завершился бы до появления сети.
    saving.catch((error) => console.error("Failed to save the board:", error));
    navigate({ to: "/" });
  };

  if (boardId && isLoading) return <Preloader />;
  if (boardId && !currentBoard) return <NotFound message="Проект не найден" />;

  return (
    <form onSubmit={submitForm} className="board-form">
      <h3 className="board-form__title">
        {boardId ? "Редактирование доски" : "Создание новой доски"}
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

      <div className="board-form__controls">
        <BackButton>Отмена</BackButton>
        <Button type="submit" mod="wide">
          {boardId ? "Сохранить" : "Создать"}
        </Button>
      </div>
    </form>
  );
};
