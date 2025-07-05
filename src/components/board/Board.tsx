import { BoardType } from '../../utils/constants';
import './board.styles.css';

type BoardProps = {
	data: BoardType;
};

export const Board = ({ data }: BoardProps) => {
	return (
		<li id={data.id} className='board'>
			<header className='board__header'>{data.title}</header>
			<div className='board__body'>
				{data.description && (
					<p>
						<em>{data.description}</em>
					</p>
				)}
			</div>
		</li>
	);
};
