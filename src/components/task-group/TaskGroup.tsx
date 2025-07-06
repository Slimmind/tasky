import { lazy, useMemo } from 'react';
import { TaskType, TaskVariants } from '../../utils/constants';
import './task-group.styles.css';

const Task = lazy(() => import('../task'));
const GhostTask = lazy(() => import('../ghost-task'));
const CategoryIcon = lazy(() => import('../category-icon'));

type TaskGroupProps = {
	boardId: string;
	group: string;
	tasks: TaskType[];
};

export const TaskGroup = ({ boardId, group, tasks }: TaskGroupProps) => {
	const categoriesWithTasks = useMemo(() => {
		const categories = new Set<string>();
		tasks.forEach((task) => {
			if (task.type) {
				categories.add(task.type);
			}
		});
		return Array.from(categories);
	}, [tasks]);

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
				{group === TaskVariants.BACKLOG && <GhostTask boardId={boardId} />}
			</ul>
		</li>
	);
};
