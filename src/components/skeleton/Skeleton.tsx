import './skeleton.styles.css';

export const Skeleton = () => {
	const itemsQty = 10;
	const skeletonItems = Array.from({ length: itemsQty });

	return (
		<div className='skeleton'>
			{skeletonItems.map((_, idx) => (
				<div
					key={idx}
					className='skeleton__item'
					style={{ animation: `skeleton 1s ${0.2 * idx}s infinite` }}
				></div>
			))}
		</div>
	);
};
