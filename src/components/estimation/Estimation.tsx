import { TaskTimeType } from '../../utils/constants';
import './estimation.styles.css';

type EstimationProps = {
	data: TaskTimeType;
};

export const Estimation = ({ data }: EstimationProps) => {
	// const spentValue = Math.ceil((data.spentTime / data.estimationTime) * 100);
	return (
		<div className='estimation'>
			<div className='estimation__value'>Estimation: {data.estimation}</div>
			{/* <div className='estimation__graph'>
				<div
					className='estimation__graph-spent'
					style={{ width: `${spentValue}%` }}
				></div>
				<div className='estimation__graph-over'></div>
			</div> */}
		</div>
	);
};
