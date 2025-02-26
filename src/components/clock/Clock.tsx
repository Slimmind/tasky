// import { lazy, useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import './clock.styles.css';

// const Panel = lazy(() => import('../panel'));

export const Clock = () => {
	const [time, setTime] = useState<string>('');
	// const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

	// const toggleMenu = (): void => {
	// 	setIsMenuVisible((prev) => !prev);
	// };

	const updateTime = () => {
		const currentTime = new Date();
		const hours = String(currentTime.getHours()).padStart(2, '0');
		const minutes = String(currentTime.getMinutes()).padStart(2, '0');
		const seconds = String(currentTime.getSeconds()).padStart(2, '0');
		setTime(`${hours}:${minutes}:${seconds}`);
	};

	useEffect(() => {
		updateTime();

		const intervalId = setInterval(() => {
			updateTime();
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);
	return (
		<>
			{/* <div className='clock' onClick={toggleMenu}> */}
			<div className='clock'>
				{time}
			</div>
			{/* <Panel isActive={isMenuVisible} mod='clock'></Panel> */}
		</>
	);
};
