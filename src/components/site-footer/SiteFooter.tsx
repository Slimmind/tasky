import { lazy } from 'react';
import './site-footer.styles.css';
import { useBoards } from '../../context/boards.context';

const AddTask = lazy(() => import('../add-task'));
const Button = lazy(() => import('../button'));
// const Search = lazy(() => import('../search'));

export const SiteFooter = () => {
	const { setBoardsShown } = useBoards();
	const now = new Date();
	const currentYear = now.getFullYear();
	return (
		<footer className='site-footer'>
			<small className='site-footer__copyright'>
				SLIMMIND &copy; {currentYear}
			</small>

			<div className='site-footer__controls'>
				{/* <Search
						isActive={activePanel === 'search'}
						togglePanel={() =>
							handlePanel(activePanel === 'search' ? null : 'search')
						}
					/> */}
				<Button
					mod='icon boards'
					aria-label='go to boards'
					onClick={setBoardsShown}
				/>
				<AddTask />
			</div>
		</footer>
	);
};
