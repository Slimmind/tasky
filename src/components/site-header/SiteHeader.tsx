import { lazy } from 'react';
import './site-header.styles.css';

const Clock = lazy(() => import('../clock'));
const SiteLogo = lazy(() => import('../site-logo'));

export const SiteHeader = () => {
	return (
		<header className='site-header'>
			<SiteLogo />
			<Clock />
		</header>
	);
};
