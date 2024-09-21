import { useState } from 'react';
import Button from '../button';
import Panel from '../panel';
import './auth.styles.css';

export const Auth = () => {
	const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

	const toggleMenu = (): void => {
		setIsMenuVisible((prev) => !prev);
	};

	return (
		<>
			<Button mod='auth' onClick={toggleMenu} />
			<Panel isActive={isMenuVisible}>AUTH</Panel>
		</>
	);
};
