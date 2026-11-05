import { Link } from "@tanstack/react-router";
import { GhostItemConfig } from "../../utils/constants";
import "./ghost-item.style.css";

export type GhostItemProps = {
  config: GhostItemConfig;
  boardId?: string;
};

export const GhostItem = ({ config, boardId }: GhostItemProps) => {
  const content = (
    <>
      <header className="ghost-item__header">
        <h4 className="ghost-item__title">{config.title}</h4>
      </header>
      <div className="ghost-item__body">
        <em className="ghost-item__description">{config.description}</em>
        <ul className="ghost-item__steps">
          {config.steps.map((step: string, index: number) => (
            <li key={index} className="ghost-item__step">
              {step}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <li className="ghost-item">
      {boardId ? (
        <Link to="/tasks/add" search={{ boardId }}>
          {content}
        </Link>
      ) : (
        <Link to="/boards/add">{content}</Link>
      )}
    </li>
  );
};
