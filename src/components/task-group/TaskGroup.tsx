import { lazy, useMemo } from 'react';
import { TaskType, TaskVariants } from '../../utils/constants';
import { useTasks } from '../../context/task.context';
import './task-group.styles.css';

const Task = lazy(() => import('../task'));
const GhostTask = lazy(() => import('../ghost-task'));
const CategoryIcon = lazy(() => import('../category-icon'));

type TaskGroupProps = {
	group: string;
	tasks: TaskType[];
};

export const TaskGroup = ({ group, tasks }: TaskGroupProps) => {
	const { categoriesWithTasks } = useTasks();

	const groupedTasks = useMemo(
		() => tasks.filter((task) => task.type === group),
		[tasks, group]
	);

	const categoryTiles = useMemo(
		() =>
			categoriesWithTasks
				.filter((category: string) => category !== group)
				.map((category: string) => (
					<a
						key={category}
						href={`#${category}`}
						className={`task-group__header-tile task-group__header-tile--${category}`}
					>
						<CategoryIcon category={category} />
					</a>
				)),
		[categoriesWithTasks, group]
	);

	return (
		<li className={`task-group task-group--${group}`}>
			<header className='task-group__header'>
				<strong
					id={group}
					className={`task-group__header-tile task-group__header-tile--main task-group__header-tile--${group}`}
				>
					<CategoryIcon category={group} />
					{group}
				</strong>
				{categoryTiles}
			</header>
			<ul className='task-group__body'>
				{groupedTasks.map((task) => (
					<Task key={task.id} data={task} />
				))}
				{group === TaskVariants.BACKLOG && <GhostTask />}
			</ul>
		</li>
	);
};
