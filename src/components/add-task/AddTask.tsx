import { lazy } from 'react';
import './add-task.styles.css';
import { usePanel } from '../../context/panel.context';
import { PanelViews } from '../../utils/constants';

const Button = lazy(() => import('../button'));
const TaskForm = lazy(() => import('../task-form'));

export const AddTask = () => {
	const { activePanel, setActivePanel } = usePanel();

	const isActive = activePanel === PanelViews.ADD;

	const togglePanel = () => {
		setActivePanel(isActive ? null : PanelViews.ADD);
	};

	return (
		<>
			<Button
				mod={`icon add ${isActive ? 'active' : ''}`}
				onClick={togglePanel}
				aria-label='toggle add task form'
			/>
			<TaskForm isActive={isActive} togglePanel={togglePanel} />
		</>
	);
};
