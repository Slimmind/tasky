import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useBoards } from '../../context/boards.context';
import { useTasks } from '../../context/task.context';
import { getRandomRGB } from '../../utils/get-random-rgb';
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
				description:
					'Заголовок и описание проекта можно будет отредактировать позже',
				color: getRandomRGB(),
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
