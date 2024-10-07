import { MoonIcon } from '../../icons/moon-icon';
import { SunIcon } from '../../icons/sun-icon';
import './theme-switcher.styles.css';

export const ThemeSwitcher = () => {
	const toggleTheme = (): void => {
		const newTheme = theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
		changeTheme(newTheme);
	};
	return (
		<div role='button' className='theme-switcher' onClick={toggleTheme}>
			<SunIcon />
			<MoonIcon />
			<div
				className={`theme-switcher__roundel theme-switcher__roundel--${theme}`}
			>
				{theme === THEME_LIGHT ? <SunIcon /> : <MoonIcon />}
			</div>
		</div>
	);
};
