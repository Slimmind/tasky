import { lazy } from 'react';
import { PanelTypes } from '../../utils/constants';
import './site-footer.styles.css';
import { useAuth } from '../../contexts/auth.context';

const TaskForm = lazy(() => import('../task-form'));
const Search = lazy(() => import('../search'));

type SiteFooterProps = {
	activePanel: string | null;
	handlePanel: (panel: PanelTypes) => void;
};

export const SiteFooter = ({ activePanel, handlePanel }: SiteFooterProps) => {
	const { currentUser } = useAuth();
	const now = new Date();
	const currentYear = now.getFullYear();
	return (
		<footer className='site-footer'>
			{currentUser?.uid && (
				<div className='site-footer__controls'>
					<Search
						isActive={activePanel === 'search'}
						togglePanel={() =>
							handlePanel(activePanel === 'search' ? null : 'search')
						}
					/>
					<TaskForm
						isActive={activePanel === 'add'}
						togglePanel={() =>
							handlePanel(activePanel === 'add' ? null : 'add')
						}
					/>
				</div>
			)}
			<small className='site-footer__copyright'>
				SLIMMIND &copy; {currentYear}
			</small>
		</footer>
	);
};
