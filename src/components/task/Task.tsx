import { lazy, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import {
	SubtaskType,
	TaskType,
	TaskVariants,
	TaskVariantType,
} from '../../utils/constants';
import clsx from 'clsx';
import { Link } from '@tanstack/react-router';
import { useBoards } from '../../context/boards.context';
import { getCurrentBoard } from '../../utils/get-current-board';
import './task.styles.css';

const Subtask = lazy(() => import('../subtask'));
const Estimation = lazy(() => import('../estimation'));
const Button = lazy(() => import('../button'));
const RemoveIcon = lazy(() => import('../../icons/remove-icon'));
const DoneIcon = lazy(() => import('../../icons/done-icon'));
const InProgressIcon = lazy(() => import('../../icons/in-progress-icon'));
const BacklogIcon = lazy(() => import('../../icons/backlog-icon'));
const TodoIcon = lazy(() => import('../../icons/todo-icon'));

type TaskProps = {
	data: TaskType;
};

type SwitcherConfig = {
	mod: string;
	anchor?: string;
	handler: () => void;
	icon: JSX.Element;
	key: string;
};

const getSwitchersConfig = (
	taskType: TaskVariantType,
	changeTaskType: (type: TaskVariantType) => void,
	removeTask: () => void
): SwitcherConfig[] => {
	switch (taskType) {
		case TaskVariants.BACKLOG:
			return [
				{
					mod: 'color todo',
					anchor: 'todo',
					handler: () => changeTaskType(TaskVariants.TODO),
					icon: <TodoIcon />,
					key: 'todo',
				},
			];
		case TaskVariants.TODO:
			return [
				{
					mod: 'color backlog',
					anchor: 'backlog',
					handler: () => changeTaskType(TaskVariants.BACKLOG),
					icon: <BacklogIcon />,
					key: 'backlog',
				},
				{
					mod: 'color inProgress',
					anchor: 'inProgress',
					handler: () => changeTaskType(TaskVariants.IN_PROGRESS),
					icon: <InProgressIcon />,
					key: 'inProgress',
				},
			];
		case TaskVariants.IN_PROGRESS:
			return [
				{
					mod: 'color todo',
					anchor: 'todo',
					handler: () => changeTaskType(TaskVariants.TODO),
					icon: <TodoIcon />,
					key: 'todo',
				},
				{
					mod: 'color done',
					anchor: 'done',
					handler: () => changeTaskType(TaskVariants.DONE),
					icon: <DoneIcon />,
					key: 'done',
				},
			];
		case TaskVariants.DONE:
			return [
				{
					mod: 'color inProgress',
					anchor: 'inProgress',
					handler: () => changeTaskType(TaskVariants.IN_PROGRESS),
					icon: <InProgressIcon />,
					key: 'inProgress',
				},
				{
					mod: 'color delete',
					handler: removeTask,
					icon: <RemoveIcon />,
					key: 'delete',
				},
				{
					mod: 'color backlog',
					anchor: 'backlog',
					handler: () => changeTaskType(TaskVariants.BACKLOG),
					icon: <BacklogIcon />,
					key: 'backlog',
				},
			];
		default:
			return [];
	}
};

export const Task = ({ data }: TaskProps) => {
	const { boards, changeBoard } = useBoards();
	const elementRef = useRef<HTMLHeadingElement>(null);

	const [isCollapsed, setIsCollapsed] = useState(
		data.type === TaskVariants.DONE
	);
	const [titleHeight, setTitleHeight] = useState<number>(0);
	const currentBoard = getCurrentBoard(data.boardId, boards);

	useEffect(() => {
		if (elementRef.current) {
			setTitleHeight(elementRef.current.offsetHeight);
		}
	}, []);

	const updateTask = useCallback(
		(subtask: SubtaskType) => {
			const updatedSubtasks = data.subtasks.map((item) =>
				item.id === subtask.id ? subtask : item
			);

			const updatedTask = { ...data, subtasks: updatedSubtasks };
			const updatedBoard = {
				...currentBoard,
				tasks: [
					...(currentBoard.tasks?.filter(
						(task) => task.id !== updatedTask.id
					) || []),
					updatedTask,
				],
			};

			changeBoard(data.boardId, updatedBoard);
		},
		[data, currentBoard, data.boardId, changeBoard]
	);

	const changeTaskType = useCallback(
		(taskType: TaskVariantType) => {
			const updatedTask = { ...data, type: taskType };
			const updatedBoard = {
				...currentBoard,
				tasks: [
					...(currentBoard.tasks?.filter(
						(task) => task.id !== updatedTask.id
					) || []),
					updatedTask,
				],
			};
			changeBoard(data.boardId, updatedBoard);
		},
		[data, currentBoard, data.boardId, changeBoard]
	);

	const removeTask = useCallback(() => {
		const updatedBoard = {
			...currentBoard,
			tasks: currentBoard.tasks?.filter((task) => task.id !== data.id) || [],
		};
		changeBoard(data.boardId, updatedBoard);
	}, [data.id, currentBoard, data.boardId, changeBoard]);

	const switchers = useMemo(
		() => getSwitchersConfig(data.type, changeTaskType, removeTask),
		[data.type, changeTaskType, removeTask]
	);

	const classes = clsx('task', `task--${data.type}`, {
		'task--collapsed': isCollapsed,
	});

	return (
		<li
			className={classes}
			id={data.id}
			style={{ maxHeight: isCollapsed ? titleHeight : 640 }}
		>
			<header className='task__header'>
				{data.type !== TaskVariants.DONE ? (
					<Link
						to='/tasks/edit/$taskId'
						params={{ taskId: data.id }}
						search={{ boardId: data.boardId }}
					>
						<h4 ref={elementRef} className='task__title'>
							{data.title}
						</h4>
					</Link>
				) : (
					<h4
						ref={elementRef}
						className='task__title'
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						{data.title}
					</h4>
				)}
				<div className='task__header-controls'>
					{switchers.map((config) => (
						<Button
							key={config.key}
							mod={config.mod}
							href={`#${config.anchor}`}
							onClick={config.handler}
							aria-label={`switch task type to ${config.key}`}
						>
							{config.icon}
						</Button>
					))}
				</div>
			</header>
			<div className='task__body'>
				{data.description && (
					<em className='task__description'>{data.description}</em>
				)}
				{data.subtasks.length > 0 && (
					<ul className='task__subtasks'>
						{data.subtasks.map((subtask) => (
							<Subtask
								key={subtask.id}
								data={subtask}
								changeSubtaskHandler={updateTask}
							/>
						))}
					</ul>
				)}
			</div>
			<footer className='task__footer'>
				<Estimation data={data.time} />
			</footer>
		</li>
	);
};
