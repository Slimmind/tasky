import { memo } from "react";
import { taskGroupList } from "../../utils/constants";
import { useBoardsStore } from "../../store/boards.store";
import TaskGroup from "../task-group";
import NotFound from "../not-found";
import Preloader from "../preloader";
import { ErrorMessage } from "../error-message";
import "./tasks.styles.css";

type TasksTypes = {
  boardId: string;
};

export const Tasks = memo(({ boardId }: TasksTypes) => {
  const board = useBoardsStore((state) =>
    state.boards.find((item) => item.id === boardId),
  );
  const isLoading = useBoardsStore((state) => state.isLoading);
  const error = useBoardsStore((state) => state.error);

  if (isLoading) return <Preloader />;
  if (error) return <ErrorMessage message={error} />;
  if (!board) return <NotFound message="Проект не найден" />;

  const tasks = board.tasks ?? [];

  return (
    <div className="tasks">
      <ul className="tasks__group-list">
        {taskGroupList.map((group: string) => (
          <TaskGroup
            key={group}
            group={group}
            tasks={tasks}
            boardId={boardId}
          />
        ))}
      </ul>
    </div>
  );
});
