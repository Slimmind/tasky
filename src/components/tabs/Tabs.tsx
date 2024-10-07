import './tabs.styles.css';

export const Tabs = () => {
	return (
		<div className='tabs'>
			<header className='tabs__header'>
				<ul className='tabs__header-list'>
					<li className='tabs__header-item tabs__header-item--active'>
						CALENDAR
					</li>
					<li className='tabs__header-item'>TIMER</li>
					<li className='tabs__header-item'>ALARM</li>
				</ul>
			</header>
			<div className='tabs__content'>
				<ul className='tabs__content-list'>
					<li className='tabs__content-item tabs__content-item--active'>
						CALENDAR
					</li>
					<li className='tabs__content-item'>TIMER</li>
					<li className='tabs__content-item'>ALARM</li>
				</ul>
			</div>
		</div>
	);
};
