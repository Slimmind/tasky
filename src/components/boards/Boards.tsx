import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useBoards } from '../../context/boards.context';
import { useTasks } from '../../context/task.context';
import { Board } from '../board/Board';
import './boards.styles.css';

export const Boards = () => {
	const { boards, addBoard } = useBoards();
	const { tasks } = useTasks();

	useEffect(() => {
		if (boards.length === 0) {
			const firstBoard = {
				id: nanoid(),
				name: 'first-board',
				title: 'Первый проект',
				color: '#00766e',
				tasks: tasks,
			};

			addBoard(firstBoard);
		}
	}, []);

	return (
		<ul className='boards'>
			{boards.map((board) => (
				<Board key={board.id} data={board} />
			))}
		</ul>
	);
};
