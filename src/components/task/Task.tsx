import { lazy, useCallback } from 'react';
import {
	PanelTypes,
	SubtaskType,
	TaskType,
	TaskVariants,
	TaskVariantType,
} from '../../utils/constants';
import { useTasks } from '../../context/task.context';
import './task.styles.css';

const Subtask = lazy(() => import('../subtask'));
const Estimation = lazy(() => import('../estimation'));
const Button = lazy(() => import('../button'));

type TaskProps = {
	data: TaskType;
	handlePanel: (panel: PanelTypes) => void;
};

const getSwitchersConfig = (
	taskType: TaskVariantType,
	changeTaskType: (type: TaskVariantType) => void,
	removeTask: () => void
) => {
	return {
		[TaskVariants.BACKLOG]: [
			{ mod: 'color todo', handler: () => changeTaskType('todo') },
		],
		[TaskVariants.TODO]: [
			{ mod: 'color backlog', handler: () => changeTaskType('backlog') },
			{ mod: 'color inProgress', handler: () => changeTaskType('inProgress') },
		],
		[TaskVariants.IN_PROGRESS]: [
			{ mod: 'color todo', handler: () => changeTaskType('todo') },
			{ mod: 'color done', handler: () => changeTaskType('done') },
		],
		[TaskVariants.DONE]: [
			{ mod: 'color inProgress', handler: () => changeTaskType('inProgress') },
			{ mod: 'color delete', handler: removeTask },
			{ mod: 'color backlog', handler: () => changeTaskType('backlog') },
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
			onClick={config.handler}
			aria-label={`switch task type to ${taskType}`}
		/>
	));
};

export const Task = ({ data, handlePanel }: TaskProps) => {
	const { changeTask, removeTask } = useTasks();

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
				<h4 className='task__title' onClick={() => handlePanel('edit')}>
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
					<em className='task__description' onClick={() => handlePanel('edit')}>
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
				<Estimation data={data.time} />
			</footer>
		</li>
	);
};
