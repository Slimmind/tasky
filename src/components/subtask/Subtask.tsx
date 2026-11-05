import { KeyboardEvent, memo } from "react";
import clsx from "clsx";
import { SubtaskType } from "../../utils/constants";
import "./subtask.styles.css";

type SubtaskProps = {
  data: SubtaskType;
  onToggle: (subtaskId: string) => void;
  mod?: string;
};

export const Subtask = memo(({ data, onToggle, mod }: SubtaskProps) => {
  const classes = clsx(
    "subtask",
    data.checked && "subtask--checked",
    mod && `subtask--${mod}`,
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(data.id);
    }
  };

  return (
    <li
      className={classes}
      id={data.id}
      role="checkbox"
      aria-checked={data.checked}
      tabIndex={0}
      onClick={() => onToggle(data.id)}
      onKeyDown={handleKeyDown}
    >
      {data.value}
    </li>
  );
});
