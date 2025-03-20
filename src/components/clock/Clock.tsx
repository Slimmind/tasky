import { useEffect, useState } from 'react';
import './clock.styles.css';

const formatTime = (date: Date): string => {
	return date.toLocaleTimeString('ru-RU', { hour12: false });
};

export const Clock = () => {
	const [time, setTime] = useState(() => formatTime(new Date()));

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(formatTime(new Date()));
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return <div className='clock'>{time}</div>;
};
