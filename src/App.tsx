import { lazy, Suspense } from 'react';
import Preloader from './components/preloader';
import './index.css';
import { usePanel } from './context/panel.context';

const ErrorBoundary = lazy(() => import('./components/error-boundary'));
const SiteHeader = lazy(() => import('./components/site-header'));
const SiteFooter = lazy(() => import('./components/site-footer'));
const Welcome = lazy(() => import('./components/welcome'));
const Tasks = lazy(() => import('./components/tasks'));
const TaskForm = lazy(() => import('./components/task-form'));

function App() {
	const { activePanel, activeTaskId, setActivePanel } = usePanel();

	return (
		<>
			<Suspense fallback={<Preloader />}>
				<SiteHeader />
				<ErrorBoundary>
					<main>
						<Welcome />
						<Tasks />
						{activePanel === 'edit' && activeTaskId && (
							<TaskForm
								taskId={activeTaskId}
								isActive={true}
								togglePanel={() => setActivePanel(null)}
							/>
						)}
					</main>
				</ErrorBoundary>
				<SiteFooter />
			</Suspense>
		</>
	);
}

export default App;
