import { BoardType } from '../../utils/constants';
import './board.styles.css';

type BoardProps = {
	data: BoardType;
};

export const Board = ({ data }: BoardProps) => {
	return (
		<li className='board' id={data.id} style={{ backgroundColor: data.color }}>
			<h2 className='board__title'>{data.title}</h2>
		</li>
	);
};
