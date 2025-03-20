import { lazy } from 'react';
import { PanelViews } from '../../utils/constants';
import { usePanel } from '../../context/panel.context';
import { useAuth } from '../../context/auth.context';
import './site-header.styles.css';

const SiteLogo = lazy(() => import('../site-logo'));
// const Clock = lazy(() => import("../clock"));
const Button = lazy(() => import('../button'));

export const SiteHeader = () => {
	const { activePanel, setActivePanel } = usePanel();
	const { currentUser } = useAuth();
	console.log('CURRENT USER', currentUser);

	const isActive = activePanel === PanelViews.AUTH;

	const togglePanel = () => {
		setActivePanel(isActive ? null : PanelViews.AUTH);
	};

	return (
		<header className='site-header'>
			<SiteLogo />
			{/* <Clock /> */}
			{currentUser ? (
				<Button
					mod='secondary user-name'
					onClick={togglePanel}
					aria-label='toggle auth form'
				>
					{currentUser?.displayName}
				</Button>
			) : (
				<Button
					mod='icon auth'
					onClick={togglePanel}
					aria-label='toggle auth form'
				></Button>
			)}
		</header>
	);
};
