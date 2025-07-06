import { BoardType } from './constants';

export const getCurrentBoard = (
	boardId: string,
	boards: BoardType[]
): BoardType => {
	return boards.find((board: BoardType) => board.id === boardId)!;
};
