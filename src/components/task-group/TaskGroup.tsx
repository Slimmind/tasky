import { TaskType } from '../../utils/constants';
import { Task } from '../task/Task';
import './task-group.styles.css';

type TaskGroupProps = {
	group: string;
	tasks: TaskType[];
};

export const TaskGroup = ({ group, tasks }: TaskGroupProps) => {
	const groupedTasks = tasks.filter((task) => task.type === group);
	return (
		<li className={`task-group task-group--${group}`}>
			<header className='task-group__header'>{group}</header>
			<ul>
				{groupedTasks.map((task) => (
					<Task key={task.id} data={task} />
				))}
			</ul>
		</li>
	);
};
