import {
	ChangeEvent,
	FormEvent,
	useState,
	useEffect,
	lazy,
	useCallback,
	memo,
} from 'react';
import './board-form.styles.css';
import { useBoards } from '../../context/boards.context';
import { useNavigate } from '@tanstack/react-router';
import { BoardType } from '../../utils/constants';
import { getColor } from '../../utils/get-color';
import { getRandomRGB } from '../../utils/get-random-rgb';
import BackButton from '../back-button';

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
			const boardData = buildBoard();
			console.log('TASK: ', boardData);

			if (boardId) {
				// For editing, we need to pass the full board object with id
				const updatedBoard = { ...boardData, id: boardId };
				changeBoard(boardId, updatedBoard);
			} else {
				// For creating, we pass the board data without id
				addBoard(boardData);
			}
			resetForm();
			navigate({ to: '/' });
		},
		[title, description, boardId, changeBoard, addBoard]
	);

	const buildBoard = useCallback(
		(): Omit<BoardType, 'id'> => ({
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
				<h3 className='board-form__title'>
					{boardId ? 'Редактирование доски' : 'Создание новой доски'}
				</h3>
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

				<div className='board-form__controls'>
					<BackButton>Отмена</BackButton>
					{boardId ? (
						<Button type='submit' mod='wide'>
							Сохранить
						</Button>
					) : (
						<Button type='submit' mod='wide'>
							Создать
						</Button>
					)}
				</div>
			</form>
		</>
	);
};
