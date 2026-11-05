import { TaskVariants } from "../../utils/constants";
import "./category-icon.styles.css";

import BacklogIcon from "../../icons/backlog-icon";
import TodoIcon from "../../icons/todo-icon";
import InProgressIcon from "../../icons/in-progress-icon";
import DoneIcon from "../../icons/done-icon";

type CategoryIconProps = {
  category: string;
};

export const CategoryIcon = ({ category }: CategoryIconProps) => {
  switch (category) {
    case TaskVariants.BACKLOG:
      return <BacklogIcon />;
    case TaskVariants.TODO:
      return <TodoIcon />;
    case TaskVariants.IN_PROGRESS:
      return <InProgressIcon />;
    case TaskVariants.DONE:
      return <DoneIcon />;
    default:
      return <BacklogIcon />;
  }
};
