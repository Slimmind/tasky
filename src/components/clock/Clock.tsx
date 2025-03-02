import { useEffect, useState } from 'react';
import './clock.styles.css';

export const Clock = () => {
	const [time, setTime] = useState(() => {
		const now = new Date();
		return now.toLocaleTimeString('ru-RU', { hour12: false });
	});

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date().toLocaleTimeString('ru-RU', { hour12: false }));
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return <div className='clock'>{time}</div>;
};
