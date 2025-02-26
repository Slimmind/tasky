import { useState, lazy, Suspense } from 'react';
import { PanelTypes } from './utils/constants';
import Preloader from './components/preloader';
import './index.css';

const ErrorBoundary = lazy(() => import('./components/error-boundary'));
const SiteHeader = lazy(() => import('./components/site-header'));
const SiteFooter = lazy(() => import('./components/site-footer'));
const Welcome = lazy(() => import('./components/welcome'));
const Tasks = lazy(() => import('./components/tasks'));

function App() {
	const [activePanel, setActivePanel] = useState<PanelTypes>(null);

	return (
		<>
			<Suspense fallback={<Preloader />}>
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
