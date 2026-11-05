import { useBoardsStore } from "../../store/boards.store";
import { Board } from "../board/Board";
import { GhostProjectConfig } from "../../utils/constants";
import GhostItem from "../ghost-item";
import Preloader from "../preloader";
import { ErrorMessage } from "../error-message";
import "./boards.styles.css";

export const Boards = () => {
  const boards = useBoardsStore((state) => state.boards);
  const isLoading = useBoardsStore((state) => state.isLoading);
  const error = useBoardsStore((state) => state.error);

  if (isLoading) return <Preloader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ul className="boards">
      {boards.map((board) => (
        <Board key={board.id} data={board} />
      ))}
      <GhostItem config={GhostProjectConfig} />
    </ul>
  );
};
