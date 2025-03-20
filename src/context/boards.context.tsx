import { createContext, ReactNode, useContext, useState } from 'react';

type BoardsContextType = {
	boardsShown: boolean;
	setBoardsShown: () => void;
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const BoardsProvider = ({ children }: { children: ReactNode }) => {
	const [boardsShown, setBoardsShown] = useState<boolean>(false);

	const handleSetShownBoards = (): void => {
		setBoardsShown(!boardsShown);
	};

	return (
		<BoardsContext.Provider
			value={{ boardsShown, setBoardsShown: handleSetShownBoards }}
		>
			{children}
		</BoardsContext.Provider>
	);
};

export const useBoards = () => {
	const context = useContext(BoardsContext);

	if (!context) {
		throw new Error('useBoards must be used within a BoardsProvider');
	}

	return context;
};
