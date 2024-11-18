import { ChangeEvent, lazy, useState } from 'react';

const Button = lazy(() => import('../button'));
const Panel = lazy(() => import('../panel'));
const Input = lazy(() => import('../input'));

type SearchProps = {
	isActive: boolean;
	togglePanel: () => void;
};

export const Search = ({ isActive, togglePanel }: SearchProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setSearchQuery(event.target.value);
	};
	return (
		<>
			<Button mod='icon search' onClick={togglePanel} aria-label='search' />
			<Panel isActive={isActive} title='Search'>
				<Input
					id='title'
					value={searchQuery}
					onChange={handleInputChange}
					type='search'
				/>
			</Panel>
		</>
	);
};
