import { lazy } from 'react';
// import { useAuth } from './contexts/auth.context';
import { useState } from 'react';
import { PanelTypes } from './utils/constants';
import { useAuth } from './contexts/auth.context';
import './index.css';
import Tasks from './components/tasks';

const SiteHeader = lazy(() => import('./components/site-header'));
const SiteFooter = lazy(() => import('./components/site-footer'));

function App() {
	const { currentUser } = useAuth();
	const [activePanel, setActivePanel] = useState<PanelTypes>(null);

	return (
		<>
			<SiteHeader activePanel={activePanel} handlePanel={setActivePanel} />
			<main>{currentUser?.uid && <Tasks />}</main>
			<SiteFooter activePanel={activePanel} handlePanel={setActivePanel} />
		</>
	);
}

export default App;
