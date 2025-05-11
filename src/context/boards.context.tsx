import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import { nanoid } from 'nanoid';
import { mainProjectName, type BoardType } from '../utils/constants';
import { getRandomColor } from '../utils/get-random-color';

type BoardsContextType = {
	boards: BoardType[];
	boardsShown: boolean;
	setBoardsShown: () => void;
	addBoard: (board: Omit<BoardType, 'id'>) => void;
	removeBoard: (id: string) => void;
	changeBoard: (id: string, task: BoardType) => void;
};

const BoardContext = createContext<BoardsContextType | undefined>(undefined);
const defaultBorder = {
	id: 'default_border',
	name: 'default_border',
	title: 'Твой первый проект',
	color: getRandomColor(),
	subtitle: '',
	description:
		'Это проект, созданный по умолчание. В Дальнейшем его можно перименовать и использовать или удалить',
	tasks: [],
};

export const BoardsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [boardsShown, setBoardsShown] = useState<boolean>(false);

	const handleSetShownBoards = useCallback((): void => {
		setBoardsShown((prev) => !prev);
	}, []);

	const [boards, setBoards] = useState<BoardType[]>(() => {
		try {
			const savedBoards = localStorage.getItem(mainProjectName);
			return savedBoards ? JSON.parse(savedBoards) : [defaultBorder];
		} catch (error) {
			console.error('Ошибка при загрузке задач из localStorage:', error);
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(mainProjectName, JSON.stringify(boards));
		} catch (error) {
			console.error('Ошибка при сохранении задач в localStorage:', error);
		}
	}, [boards]);

	const addBoard = useCallback((task: Omit<BoardType, 'id'>) => {
		const newTask: BoardType = { id: nanoid(), ...task };
		setBoards((prev) => [...prev, newTask]);
	}, []);

	const removeBoard = useCallback((id: string) => {
		setBoards((prev) => prev.filter((task) => task.id !== id));
	}, []);

	const changeBoard = useCallback((id: string, updatedTask: BoardType) => {
		setBoards((prev) =>
			prev.map((task) => (task.id === id ? { ...updatedTask } : task))
		);
	}, []);

	const value = useMemo(
		() => ({
			boards,
			boardsShown,
			setBoardsShown: handleSetShownBoards,
			addBoard,
			removeBoard,
			changeBoard,
		}),
		[
			boards,
			boardsShown,
			handleSetShownBoards,
			addBoard,
			removeBoard,
			changeBoard,
		]
	);

	return (
		<BoardContext.Provider value={value}>{children}</BoardContext.Provider>
	);
};

export const useBoards = () => {
	const context = useContext(BoardContext);
	if (!context) {
		throw new Error('useBoards must be used within a BoardsProvider');
	}
	return context;
};
