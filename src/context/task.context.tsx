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
  boardId: string;
};

type BoardType = {
  id: string;
  tasks: TaskType[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode; boardId: string }> = ({
  children,
  boardId,
}) => {
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    try {
      const savedTasky = localStorage.getItem('tasky');
      if (savedTasky) {
        const tasky = JSON.parse(savedTasky);
        const board = tasky.boards.find((board: BoardType) => board.id === boardId);
        return board ? board.tasks : [];
      }
      return [];
    } catch (error) {
      console.error('Ошибка при загрузке задач из localStorage:', error);
      return [];
    }
  });

  // Сохранение задач в localStorage
  useEffect(() => {
    try {
      const savedTasky = localStorage.getItem('tasky');
      const tasky = savedTasky ? JSON.parse(savedTasky) : { boards: [] };

      // Находим текущий board
      const boardIndex = tasky.boards.findIndex((board: BoardType) => board.id === boardId);

      // Если board существует, обновляем его задачи
      if (boardIndex !== -1) {
        tasky.boards[boardIndex].tasks = tasks;
      } else {
        // Если board не существует, создаем новый
        tasky.boards.push({ id: boardId, tasks });
      }

      localStorage.setItem('tasky', JSON.stringify(tasky));
    } catch (error) {
      console.error('Ошибка при сохранении задач в localStorage:', error);
    }
  }, [tasks, boardId]);

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
    () => ({ tasks, addTask, removeTask, changeTask, categoriesWithTasks, boardId }),
    [tasks, categoriesWithTasks, boardId]
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