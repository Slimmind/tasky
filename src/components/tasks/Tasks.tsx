import { lazy } from 'react';
import { useTasks } from '../../context/task.context';
import { taskGroupList } from '../../utils/constants';
import './tasks.styles.css';

const TaskGroup = lazy(() => import('../task-group'));

export const Tasks = () => {
	const { tasks } = useTasks();

	return (
		tasks.length > 0 && (
			<div className='tasks'>
				<ul className='tasks__group-list'>
					{taskGroupList.map((group: string) => (
						<TaskGroup key={group} group={group} tasks={tasks} />
					))}
				</ul>
			</div>
		)
	);
};
