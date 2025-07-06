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
import './board-form.styles.css';
import { useBoards } from '../../context/boards.context';
import { Link, useNavigate } from '@tanstack/react-router';
import { BoardType } from '../../utils/constants';
import { getColor } from '../../utils/get-color';
import { getRandomRGB } from '../../utils/get-random-rgb';

const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));

type BoardFormProps = {
	boardId?: string;
};

// Мемоизированный компонент Input
const MemoizedInput = memo(Input);

export const BoardForm = ({ boardId }: BoardFormProps) => {
	const { boards, addBoard, changeBoard } = useBoards();
	const navigate = useNavigate();
	const currentBoard = boards.find((board: BoardType) => board.id === boardId);

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	// Инициализация состояния при изменении currentBoard
	useEffect(() => {
		if (currentBoard) {
			setTitle(currentBoard.title ?? '');
			setDescription(currentBoard.description ?? '');
		}
	}, [currentBoard]);

	// Мемоизированный обработчик изменения input
	const handleInputChange = useCallback(
		(setter: React.Dispatch<React.SetStateAction<string>>) =>
			(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
				setter(event.target.value),
		[]
	);

	// Мемоизированная функция отправки формы
	const submitForm = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			const newBoard = buildBoard();
			console.log('TASK: ', newBoard);

			if (boardId) {
				changeBoard(boardId, newBoard);
			} else {
				addBoard(newBoard);
			}
			resetForm();
			navigate({ to: '/' });
		},
		[title, description, boardId, changeBoard, addBoard]
	);

	const buildBoard = useCallback(
		(): BoardType => ({
			id: nanoid(),
			title,
			description,
			color: getColor(getRandomRGB()),
			tasks: [],
		}),
		[title, description]
	);

	// Функция сброса формы
	const resetForm = useCallback(() => {
		setTitle('');
		setDescription('');
	}, []);

	return (
		<>
			<form onSubmit={submitForm} className='board-form'>
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

				{boardId ? (
					<div className='board-form__controls'>
						<Link to='/' className='btn btn--wide btn--cancel'>
							Отмена
						</Link>
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
		</>
	);
};
