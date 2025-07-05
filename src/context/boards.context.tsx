import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { BoardType } from '../utils/constants';
import { nanoid } from 'nanoid';

type BoardsContextType = {
	boards: BoardType[];
	boardsShown: boolean;
	addBoard: (board: Omit<BoardType, 'id'>) => void;
	removeBoard: (id: string) => void;
	changeBoard: (id: string, board: BoardType) => void;
	setBoardsShown: () => void;
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const BoardsProvider = ({ children }: { children: ReactNode }) => {
	const [boardsShown, setBoardsShown] = useState<boolean>(false);
	const [boards, setBoards] = useState<BoardType[]>(() => {
		try {
			const savedBoards = localStorage.getItem('boards');
			return savedBoards ? JSON.parse(savedBoards) : [];
		} catch (error) {
			console.error('Ошибка при загрузке задач из localStorage:', error);
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem('boards', JSON.stringify(boards));
		} catch (error) {
			console.error('Ошибка при сохранении задач в localStorage:', error);
		}
	}, [boards]);

	const addBoard = useCallback((board: Omit<BoardType, 'id'>) => {
		const newBoard: BoardType = { id: nanoid(), ...board };
		setBoards((prev) => [...prev, newBoard]);
	}, []);

	const removeBoard = useCallback((id: string) => {
		setBoards((prev) => prev.filter((board) => board.id !== id));
	}, []);

	const changeBoard = useCallback((id: string, updatedBoard: BoardType) => {
		setBoards((prev) =>
			prev.map((board) => (board.id === id ? { ...updatedBoard } : board))
		);
	}, []);

	const handleSetShownBoards = useCallback((): void => {
		setBoardsShown(!boardsShown);
	}, [boardsShown]);

	const value = useMemo(
		() => ({
			boards,
			boardsShown,
			addBoard,
			removeBoard,
			changeBoard,
			setBoardsShown: handleSetShownBoards,
		}),
		[
			addBoard,
			boards,
			boardsShown,
			changeBoard,
			handleSetShownBoards,
			removeBoard,
		]
	);

	return (
		<BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
	);
};

export const useBoards = () => {
	const context = useContext(BoardsContext);

	if (!context) {
		throw new Error('useBoards must be used within a BoardsProvider');
	}

	return context;
};
