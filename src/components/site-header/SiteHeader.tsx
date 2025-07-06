import { lazy } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../context/auth.context';
import { Link } from '@tanstack/react-router';
import './site-header.styles.css';

const SiteLogo = lazy(() => import('../site-logo'));

export const SiteHeader = () => {
	const { currentUser } = useAuth();

	const classes = clsx(
		'btn',
		currentUser ? 'btn--secondary user-name' : 'btn--icon btn--auth'
	);

	return (
		<header className='site-header'>
			<SiteLogo />

			<Link to='/signin' className={classes}>
				{currentUser && currentUser?.displayName}
			</Link>
		</header>
	);
};
