import { Link } from '@tanstack/react-router';
import { BoardType } from '../../utils/constants';
import { getColor } from '../../utils/get-color';
import EditIcon from '../../icons/edit-icon';
import Button from '../button';
import RemoveIcon from '../../icons/remove-icon';
import { useBoards } from '../../context/boards.context';
import './board.styles.css';

type BoardProps = {
	data: BoardType;
};

export const Board = ({ data }: BoardProps) => {
	const { removeBoard } = useBoards();

	const onRemoveBoard = (): void => {
		removeBoard(data.id);
	};
	return (
		<li
			id={data.id}
			className='board'
			style={{
				backgroundColor: getColor(data.color, 0.2),
				border: `1px solid ${getColor(data.color, 0.2)}`,
				color: getColor(data.color),
			}}
		>
			<header className='board__header'>
				<Link
					to={`/boards/$boardId`}
					params={{ boardId: data.id }}
					className='board__header-title'
				>
					<h3>{data.title}</h3>
				</Link>
				<div className='board__header-controls'>
					<Button
						mod='color delete'
						onClick={onRemoveBoard}
						aria-label='edit board'
					>
						<RemoveIcon />
					</Button>
					<Link
						to={`/boards/edit/$boardId`}
						params={{ boardId: data.id as string }}
						className='btn--color btn--done'
						aria-label='edit board'
					>
						<EditIcon />
					</Link>
				</div>
			</header>
			{data.description && (
				<div className='board__body'>
					<Link to={`/boards/$boardId`} params={{ boardId: data.id }}>
						<p>
							<em>{data.description}</em>
						</p>
					</Link>
				</div>
			)}
		</li>
	);
};
