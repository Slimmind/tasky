import { lazy, memo } from 'react';
import { taskGroupList } from '../../utils/constants';
import { useBoards } from '../../context/boards.context';
import './tasks.styles.css';

type TasksTypes = {
	boardId: string;
};

const TaskGroup = lazy(() => import('../task-group'));

// Memoize the Tasks component to prevent unnecessary re-renders
const TasksComponent = memo(({ boardId }: TasksTypes) => {
	const { boards } = useBoards();
	const tasks = boards.find((board) => board.id === boardId)?.tasks || [];

	return (
		<div className='tasks'>
			<ul className='tasks__group-list'>
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

// Export the memoized component
export const Tasks = TasksComponent;
