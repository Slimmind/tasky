import { lazy } from 'react';
import { PanelTypes } from '../../utils/constants';
import './site-header.styles.css';

const Auth = lazy(() => import('../auth'));
const Clock = lazy(() => import('../clock'));
const SiteLogo = lazy(() => import('../site-logo'));

type SiteHeaderProps = {
	activePanel: string | null;
	handlePanel: (panel: PanelTypes) => void;
};

export const SiteHeader = ({ activePanel, handlePanel }: SiteHeaderProps) => {
	return (
		<header className='site-header'>
			<SiteLogo />
			<Clock />
			<Auth
				isActive={activePanel === 'auth'}
				togglePanel={() => handlePanel(activePanel === 'auth' ? null : 'auth')}
			/>
		</header>
	);
};
