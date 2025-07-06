import { lazy } from 'react';
import './site-footer.styles.css';

const AddTask = lazy(() => import('../add-task'));

export const SiteFooter = () => {
	const now = new Date();
	const currentYear = now.getFullYear();
	return (
		<footer className='site-footer'>
			<small className='site-footer__copyright'>
				SLIMMIND &copy; {currentYear}
			</small>

			<div className='site-footer__controls'>
				<AddTask />
			</div>
		</footer>
	);
};
