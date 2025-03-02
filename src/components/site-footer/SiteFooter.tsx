import { lazy } from 'react';
import './site-footer.styles.css';

const AddTask = lazy(() => import('../add-task'));
// const Search = lazy(() => import('../search'));

export const SiteFooter = () => {
	const now = new Date();
	const currentYear = now.getFullYear();
	return (
		<footer className='site-footer'>
			<small className='site-footer__copyright'>
				SLIMMIND &copy; {currentYear}
			</small>

			<div className='site-footer__controls'>
				{/* <Search
						isActive={activePanel === 'search'}
						togglePanel={() =>
							handlePanel(activePanel === 'search' ? null : 'search')
						}
					/> */}
				<AddTask />
			</div>
		</footer>
	);
};
