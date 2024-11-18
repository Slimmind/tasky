import { useCallback } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { SubtaskType, TaskType } from '../../utils/constants';
import Subtask from '../subtask';
import './task.styles.css';
import Estimation from '../estimation';

type TaskProps = {
	data: TaskType;
};

export const Task = ({ data }: TaskProps) => {
	const { changeTask } = useFirestore();

	const updateTask = useCallback(
		(subtask: SubtaskType) => {
			if (data?.subtasks?.length === 0) return;

			const updatedSubtasks = data?.subtasks?.map((item) =>
				item.id === subtask.id ? subtask : item
			);
			const updatedTask = { ...data, subtasks: updatedSubtasks };

			changeTask(data.id, updatedTask);
		},
		[data, changeTask]
	);

	return (
		<li className={`task task--${data.type}`} id={data.id}>
			<header className='task__header'>
				<h4 className='task__title'>{data.title}</h4>
			</header>
			<div className='task__body'>
				{data.description && (
					<em className='task__description'>{data.description}</em>
				)}
				{data.subtasks && (
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
