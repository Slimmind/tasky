import { lazy } from 'react';
import { PanelTypes, TaskType } from '../../utils/constants';
import './task-group.styles.css';

const Task = lazy(() => import('../task'));

type TaskGroupProps = {
	group: string;
	tasks: TaskType[];
	handlePanel: (panel: PanelTypes) => void;
};

export const TaskGroup = ({ group, tasks, handlePanel }: TaskGroupProps) => {
	const groupedTasks = tasks.filter((task) => task.type === group);
	return (
		<li className={`task-group task-group--${group}`}>
			<header className='task-group__header'>{group}</header>
			<ul className='task-group__body'>
				{groupedTasks.map((task) => (
					<Task key={task.id} data={task} handlePanel={handlePanel} />
				))}
			</ul>
		</li>
	);
};
