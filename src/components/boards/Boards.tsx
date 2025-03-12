import { lazy } from 'react';
import { usePanel } from '../../context/panel.context';
import { PanelViews } from '../../utils/constants';
import './boards.styles.css';

const Button = lazy(() => import('../button'));

export const Boards = () => {
	const { activePanel, setActivePanel } = usePanel();

	const isActive = activePanel === PanelViews.BOARDS;

	const togglePanel = () => {
		setActivePanel(isActive ? null : PanelViews.BOARDS);
	};

	return (
		<>
			<Button
				mod={`icon add ${isActive ? 'active' : ''}`}
				onClick={togglePanel}
				aria-label='toggle add task form'
			/>
			
		</>
	);
};