import Auth from '../auth';
import Clock from '../clock';
import SiteLogo from '../site-logo';
import './site-header.styles.css';

export const SiteHeader = () => {
	return (
		<header className='site-header'>
			<SiteLogo />
			<Clock />
			<Auth />
		</header>
	);
};
