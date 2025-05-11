import {
	ChangeEvent,
	FormEvent,
	useState,
	useEffect,
	lazy,
	useCallback,
	memo,
} from 'react';
import { nanoid } from 'nanoid';
import { TaskType, SubtaskType } from '../../utils/constants';
import { useTasks } from '../../context/task.context';
import { estimationToMinutes } from '../../utils/estimation-to-minutes';
import './task-form.styles.css';

const Panel = lazy(() => import('../panel'));
const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));

type TaskFormProps = {
	isActive: boolean;
	togglePanel: () => void;
	taskId?: string; // Тип string | undefined
};

// Мемоизированный компонент Input
const MemoizedInput = memo(Input);

export const TaskForm = ({ taskId, isActive, togglePanel }: TaskFormProps) => {
	const { tasks, addTask, changeTask } = useTasks();
	const currentTask = tasks.find((task) => task.id === taskId);

	// Ленивая инициализация subtasks
	const initializeSubtasks = useCallback(
		(arr: SubtaskType[] = []): SubtaskType[] =>
			arr.length ? arr : [{ id: nanoid(), value: '', checked: false }],
		[]
	);

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [subtasks, setSubtasks] = useState<SubtaskType[]>(() =>
		initializeSubtasks(currentTask?.subtasks)
	);
	const [estimation, setEstimation] = useState<string>('');

	// Инициализация состояния при изменении currentTask
	useEffect(() => {
		if (currentTask) {
			setTitle(currentTask.title ?? '');
			setDescription(currentTask.description ?? '');
			setSubtasks(initializeSubtasks(currentTask.subtasks ?? []));
			setEstimation(currentTask.time.estimation);
		}
	}, [currentTask, initializeSubtasks]);

	// Мемоизированный обработчик изменения input
	const handleInputChange = useCallback(
		(setter: React.Dispatch<React.SetStateAction<string>>) =>
			(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
				setter(event.target.value),
		[]
	);

	// Мемоизированный обработчик изменения subtask
	const handleSubtaskChange = useCallback(
		(index: number) =>
			(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				setSubtasks((prev) =>
					prev.map((field, i) =>
						i === index ? { ...field, value: event.target.value } : field
					)
				);
			},
		[]
	);

	// Мемоизированная функция добавления subtask
	const addSubtask = useCallback(() => {
		setSubtasks((prev) => [
			...prev,
			{ id: nanoid(), value: '', checked: false },
		]);
	}, []);

	// Мемоизированная функция удаления subtask
	const removeSubtask = useCallback((fieldId: string) => {
		setSubtasks((prev) => prev.filter((field) => field.id !== fieldId));
	}, []);

	// Мемоизированная функция отправки формы
	const submitForm = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			const newTask = buildTask();
			console.log('TASK: ', newTask);

			if (taskId) {
				changeTask(taskId, newTask);
			} else {
				addTask(newTask);
			}
			resetForm();
			togglePanel();
		},
		[
			title,
			description,
			subtasks,
			estimation,
			taskId,
			changeTask,
			addTask,
			togglePanel,
		]
	);

	// Функция создания задачи
	const buildTask = useCallback(
		(): TaskType => ({
			id: nanoid(),
			project: '',
			creationDate: Date.now(),
			type: currentTask ? currentTask.type : 'backlog',
			title,
			description,
			isActive: false,
			subtasks: subtasks[0].value ? subtasks : [],
			time: {
				estimation,
				estimationTime: estimationToMinutes(estimation),
				spentTime: 0,
				leftTime: 0,
				overTime: 0,
			},
		}),
		[title, description, subtasks, estimation]
	);

	// Функция сброса формы
	const resetForm = useCallback(() => {
		setTitle('');
		setDescription('');
		setSubtasks(initializeSubtasks());
		setEstimation('');
	}, [initializeSubtasks]);

	return (
		<Panel
			filled={false}
			isActive={isActive}
			title={taskId ? 'Редактировать задание' : 'Создать новое задание'}
			mod='task-form'
		>
			<form onSubmit={submitForm}>
				<MemoizedInput
					id='title'
					value={title}
					onChange={handleInputChange(setTitle)}
					type='text'
					placeholder='Заголовок...'
				/>
				<MemoizedInput
					id='description'
					value={description}
					onChange={handleInputChange(setDescription)}
					type='textarea'
					placeholder='Описание...'
				/>

				{subtasks.map((field, index) => (
					<MemoizedInput
						key={field.id}
						id={field.id}
						type='textarea'
						placeholder={`Подзадача-${index + 1}`}
						value={field.value}
						onChange={handleSubtaskChange(index)}
					>
						<Button
							type='button'
							mod={`icon filled ${index === 0 ? 'plus' : 'minus'}`}
							aria-label={index === 0 ? 'add subtask' : 'remove subtask'}
							onClick={() =>
								index === 0 ? addSubtask() : removeSubtask(field.id)
							}
						/>
					</MemoizedInput>
				))}

				<MemoizedInput
					id='estimation'
					value={estimation}
					onChange={handleInputChange(setEstimation)}
					type='text'
					placeholder='Время на выполонение: 1w 2d 3h 4m'
					description='Формат: 1w 2d 3h 4m (недели, дни, часы, минуты)'
					pattern='^(\d+w\s?)?(\d+d\s?)?(\d+h\s?)?(\d+m)?$'
				/>

				{taskId ? (
					<div className='task-form__controls'>
						<Button type='button' mod='wide cancel' onClick={togglePanel}>
							Отмена
						</Button>
						<Button type='submit' mod='wide'>
							Сохранить
						</Button>
					</div>
				) : (
					<Button type='submit' mod='wide'>
						Создать
					</Button>
				)}
			</form>
		</Panel>
	);
};
