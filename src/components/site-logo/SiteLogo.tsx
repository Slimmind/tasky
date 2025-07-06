import { Link } from '@tanstack/react-router';
import './site-logo.styles.css';

export const SiteLogo = () => {
	return <Link to='/' className='site-logo' aria-label='Tasky' />;
};
