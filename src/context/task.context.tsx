import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import { nanoid } from 'nanoid';
import type { TaskType } from '../utils/constants';

type TaskContextType = {
	tasks: TaskType[];
	addTask: (task: Omit<TaskType, 'id'>) => void;
	removeTask: (id: string) => void;
	changeTask: (id: string, task: TaskType) => void;
	categoriesWithTasks: string[];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [tasks, setTasks] = useState<TaskType[]>(() => {
		try {
			const savedTasks = localStorage.getItem('tasks');
			return savedTasks ? JSON.parse(savedTasks) : [];
		} catch (error) {
			console.error('Ошибка при загрузке задач из localStorage:', error);
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem('tasks', JSON.stringify(tasks));
		} catch (error) {
			console.error('Ошибка при сохранении задач в localStorage:', error);
		}
	}, [tasks]);

	const addTask = useCallback((task: Omit<TaskType, 'id'>) => {
		const newTask: TaskType = { id: nanoid(), ...task };
		setTasks((prev) => [...prev, newTask]);
	}, []);

	const removeTask = useCallback((id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	}, []);

	const changeTask = useCallback((id: string, updatedTask: TaskType) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...updatedTask } : task))
		);
	}, []);

	// Функция для вычисления категорий с задачами
	const categoriesWithTasks = useMemo(() => {
		const categories = new Set<string>();
		tasks.forEach((task) => {
			if (task.type) {
				categories.add(task.type);
			}
		});
		return Array.from(categories);
	}, [tasks]);

	const value = useMemo(
		() => ({ tasks, addTask, removeTask, changeTask, categoriesWithTasks }),
		[tasks, categoriesWithTasks]
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error('useTasks must be used within a TaskProvider');
	}
	return context;
};
