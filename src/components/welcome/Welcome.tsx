import { lazy, useEffect, useState } from 'react';
import { useTasks } from '../../context/task.context';
import './welcome.styles.css';

const Panel = lazy(() => import('../panel'));

export const Welcome = () => {
	const { tasks } = useTasks();
	const [isActive, setIsActive] = useState<boolean>(tasks.length === 0);

	useEffect(() => {
		const handleClickOutside = () => {
			setIsActive(false);
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<Panel isActive={isActive} mod='welcome'>
			<h3 className='welcome__title'>Привет! :)</h3>
			<h4 className='welcome__subtitle'>Похоже, у тебя еще нет заданий...</h4>
			<h4 className='welcome__subtitle'>Нажми кнопочку "Добавить" внизу</h4>
		</Panel>
	);
};
