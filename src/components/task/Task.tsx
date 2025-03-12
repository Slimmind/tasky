import { lazy, useCallback } from 'react';
import {
	PanelViews,
	SubtaskType,
	TaskType,
	TaskVariants,
	TaskVariantType,
} from '../../utils/constants';
import { useTasks } from '../../context/task.context';
import { usePanel } from '../../context/panel.context';
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

const getSwitchersConfig = (
	taskType: TaskVariantType,
	changeTaskType: (type: TaskVariantType) => void,
	removeTask: () => void
) => {
	return {
		[TaskVariants.BACKLOG]: [
			{
				mod: 'color todo',
				anchor: 'todo',
				handler: () => changeTaskType('todo'),
				icon: <TodoIcon />,
			},
		],
		[TaskVariants.TODO]: [
			{
				mod: 'color backlog',
				anchor: 'backlog',
				handler: () => changeTaskType('backlog'),
				icon: <BacklogIcon />,
			},
			{
				mod: 'color inProgress',
				anchor: 'inProgress',
				handler: () => changeTaskType('inProgress'),
				icon: <InProgressIcon />,
			},
		],
		[TaskVariants.IN_PROGRESS]: [
			{
				mod: 'color todo',
				anchor: 'todo',
				handler: () => changeTaskType('todo'),
				icon: <TodoIcon />,
			},
			{
				mod: 'color done',
				anchor: 'done',
				handler: () => changeTaskType('done'),
				icon: <DoneIcon />,
			},
		],
		[TaskVariants.DONE]: [
			{
				mod: 'color inProgress',
				anchor: 'inProgress',
				handler: () => changeTaskType('inProgress'),
				icon: <InProgressIcon />,
			},
			{
				mod: 'color delete',
				handler: removeTask,
				icon: <RemoveIcon />,
			},
			{
				mod: 'color backlog',
				anchor: 'backlog',
				handler: () => changeTaskType('backlog'),
				icon: <BacklogIcon />,
			},
		],
	}[taskType];
};

const switchTaskVariants = (
	taskType: TaskVariantType,
	changeTaskType: (type: TaskVariantType) => void,
	removeTask: () => void
) => {
	const config = getSwitchersConfig(taskType, changeTaskType, removeTask);
	return config.map((config, index) => (
		<Button
			key={index}
			mod={config.mod}
			href={`#${config.anchor}`}
			onClick={config.handler}
			aria-label={`switch task type to ${taskType}`}
		>
			{config.icon}
		</Button>
	));
};

export const Task = ({ data }: TaskProps) => {
	const { changeTask, removeTask } = useTasks();
	const { setActivePanel } = usePanel();

	const handleEditClick = useCallback(() => {
		setActivePanel(PanelViews.EDIT, data.id);
	}, [data.id, setActivePanel]);

	const updateTask = useCallback(
		(subtask: SubtaskType) => {
			if (data?.subtasks?.length === 0) return;

			const updatedSubtasks = data?.subtasks?.map((item) =>
				item.id === subtask.id ? subtask : item
			);

			const hasChanged = !updatedSubtasks.every(
				(item, index) => item === data.subtasks[index]
			);

			if (hasChanged) {
				const updatedTask = { ...data, subtasks: updatedSubtasks };
				changeTask(data.id, updatedTask);
			}
		},
		[data, changeTask]
	);

	const changeTaskType = useCallback(
		(taskType: TaskVariantType) => {
			const updatedTask = { ...data, type: taskType };
			changeTask(data.id, updatedTask);
		},
		[data, changeTask]
	);

	return (
		<li className={`task task--${data.type}`} id={data.id}>
			<header className='task__header'>
				<h4 className='task__title' onClick={handleEditClick}>
					{data.title}
				</h4>
				<div className='task__header-controls'>
					{switchTaskVariants(data.type, changeTaskType, () =>
						removeTask(data.id)
					)}
				</div>
			</header>
			<div className='task__body'>
				{data.description && (
					<em className='task__description' onClick={handleEditClick}>
						{data.description}
					</em>
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
				<Estimation task={data} />
			</footer>
		</li>
	);
};
