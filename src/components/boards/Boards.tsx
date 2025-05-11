import { lazy } from 'react';
import { useBoards } from '../../context/boards.context';
import './boards.styles.css';

const Board = lazy(() => import('../board'));

export const Boards = () => {
	const { boards } = useBoards();
	return (
		<ul className='boards'>
			{boards.map((board) => (
				<Board data={board} />
			))}
		</ul>
	);
};
