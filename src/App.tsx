import { useState, lazy, Suspense } from 'react';
import { PanelTypes } from './utils/constants';
import ErrorBoundary from './components/error-boundary';
import './index.css';

const SiteHeader = lazy(() => import('./components/site-header'));
const SiteFooter = lazy(() => import('./components/site-footer'));
const Welcome = lazy(() => import('./components/welcome'));
const Tasks = lazy(() => import('./components/tasks'));

function App() {
	const [activePanel, setActivePanel] = useState<PanelTypes>(null);

	return (
		<>
			<Suspense fallback={<div>Загрузка...</div>}>
				<SiteHeader />
				<ErrorBoundary>
					<main>
						<Welcome />
						<Tasks />
					</main>
				</ErrorBoundary>
				<SiteFooter activePanel={activePanel} handlePanel={setActivePanel} />
			</Suspense>
		</>
	);
}

export default App;
