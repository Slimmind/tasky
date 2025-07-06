import { Link, useParams, useRouterState } from '@tanstack/react-router';
import './site-footer.styles.css';
import clsx from 'clsx';

export const SiteFooter = () => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const location = useRouterState().location;
	const isBoardOpen = location.pathname.includes('/boards');
	const isFormOpen = location.pathname.includes('/add');
	const { boardId } = useParams({ strict: false });

	const classes = clsx(
		'btn btn--icon btn--add',
		isFormOpen ? 'btn--active' : ''
	);

	return (
		<footer className='site-footer'>
			<small className='site-footer__copyright'>
				SLIMMIND &copy; {currentYear}
			</small>

			<div className='site-footer__controls'>
				<Link
					to={isBoardOpen ? '/tasks/add' : '/boards/add'}
					search={boardId ? { boardId: boardId } : ''}
					className={classes}
					aria-label='toggle add task form'
				/>
			</div>
		</footer>
	);
};
