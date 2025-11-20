import { useBoardsStore } from "../../store/boards.store";
import { Board } from "../board/Board";
import { GhostProjectConfig } from "../../utils/constants";
import GhostItem from "../ghost-item";
import "./boards.styles.css";

export const Boards = () => {
  const boards = useBoardsStore((state) => state.boards);

  return (
    <ul className="boards">
      {boards.map((board) => (
        <Board key={board.id} data={board} />
      ))}
      <GhostItem config={GhostProjectConfig} />
    </ul>
  );
};
