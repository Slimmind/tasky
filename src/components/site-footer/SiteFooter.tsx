import Add from '../add';
import MainMenu from '../main-menu';
import { Search } from '../search/Search';
import './site-footer.styles.css';

export const SiteFooter = () => {
	return (
		<footer className='site-footer'>
			<Search />
			<MainMenu />
			<Add />
		</footer>
	);
};
