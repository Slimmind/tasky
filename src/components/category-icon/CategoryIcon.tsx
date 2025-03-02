import { lazy} from 'react';
import { TaskVariants } from "../../utils/constants";
import './category-icon.styles.css';

const BacklogIcon = lazy(() => import('../../icons/backlog-icon'));
const TodoIcon = lazy(() => import('../../icons/todo-icon'));
const InProgressIcon = lazy(() => import('../../icons/in-progress-icon'));
const DoneIcon = lazy(() => import('../../icons/done-icon'));

type CategoryIconProps = {
  category: string;
}

export const CategoryIcon = ({ category }: CategoryIconProps ) => {
  switch(category) {
    case TaskVariants.BACKLOG:
      return <BacklogIcon />
    case TaskVariants.TODO:
      return <TodoIcon />
    case TaskVariants.IN_PROGRESS:
      return <InProgressIcon />
    case TaskVariants.DONE:
      return <DoneIcon />
    default:
      return <BacklogIcon />
  }
}