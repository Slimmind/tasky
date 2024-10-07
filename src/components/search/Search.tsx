import { lazy } from 'react';

const Button = lazy(() => import('../button'));
const Panel = lazy(() => import('../panel'));

type SearchProps = {
	isActive: boolean;
	togglePanel: () => void;
};

export const Search = ({ isActive, togglePanel }: SearchProps) => {
	return (
		<>
			<Button mod='icon search' onClick={togglePanel} />
			<Panel isActive={isActive}>SEARCH</Panel>
		</>
	);
};
