import { useState } from 'react';
import Button from '../button';
import Panel from '../panel';

export const Add = () => {
	const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

	const toggleMenu = (): void => {
		setIsMenuVisible((prev) => !prev);
	};

	return (
		<>
			<Button mod='add' onClick={toggleMenu} />
			<Panel isActive={isMenuVisible}>ADD</Panel>
		</>
	);
};
