import { useMemo, memo } from "react";
import { TaskType, TaskVariants, GhostTaskConfig } from "../../utils/constants";
import Task from "../task";
import GhostItem from "../ghost-item";
import CategoryIcon from "../category-icon";
import "./task-group.styles.css";

type TaskGroupProps = {
  boardId: string;
  group: string;
  tasks: TaskType[];
};

export const TaskGroup = memo(({ boardId, group, tasks }: TaskGroupProps) => {
  const categoriesWithTasks = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.type).filter(Boolean))),
    [tasks],
  );

  const groupedTasks = useMemo(
    () => tasks.filter((task) => task.type === group),
    [tasks, group],
  );

  const categoryTiles = categoriesWithTasks
    .filter((category: string) => category !== group)
    .map((category: string) => (
      <a
        key={category}
        href={`#${category}`}
        className={`task-group__header-tile task-group__header-tile--${category}`}
      >
        <CategoryIcon category={category} />
      </a>
    ));

  return (
    <li className={`task-group task-group--${group}`}>
      <header className="task-group__header">
        <strong
          id={group}
          className={`task-group__header-tile task-group__header-tile--main task-group__header-tile--${group}`}
        >
          <CategoryIcon category={group} />
          {group}
        </strong>
        {categoryTiles}
      </header>
      <ul className="task-group__body">
        {groupedTasks.map((task) => (
          <Task key={task.id} data={task} />
        ))}
        {group === TaskVariants.BACKLOG && (
          <GhostItem config={GhostTaskConfig} boardId={boardId} />
        )}
      </ul>
    </li>
  );
});
