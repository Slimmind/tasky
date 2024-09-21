import { useState } from 'react';
import Button from '../button';
import Panel from '../panel';
import './search.styles.css';

export const Search = () => {
	const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

	const toggleMenu = (): void => {
		setIsMenuVisible((prev) => !prev);
	};
	return (
		<>
			<Button mod='search' onClick={toggleMenu} />
			<Panel isActive={isMenuVisible}>SEARCH</Panel>
		</>
	);
};
