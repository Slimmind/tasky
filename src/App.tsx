import { lazy, Suspense } from 'react';
import Preloader from './components/preloader';
import { usePanel } from './context/panel.context';
import { PanelViews } from './utils/constants';
import { useBoards } from './context/boards.context';
import './index.css';

const ErrorBoundary = lazy(() => import('./components/error-boundary'));
const SiteHeader = lazy(() => import('./components/site-header'));
const SiteFooter = lazy(() => import('./components/site-footer'));
const Welcome = lazy(() => import('./components/welcome'));
const Tasks = lazy(() => import('./components/tasks'));
const TaskForm = lazy(() => import('./components/task-form'));
const AuthForm = lazy(() => import('./components/auth-form'));
const Boards = lazy(() => import('./components/boards'));

function App() {
	const { activePanel, activeTaskId, setActivePanel } = usePanel();
	const { boardsShown } = useBoards();

	return (
		<>
			<Suspense fallback={<Preloader />}>
				<SiteHeader />
				<ErrorBoundary>
					<main>
						<Welcome />
						{boardsShown ? <Boards /> : <Tasks />}
						{activePanel === PanelViews.EDIT && activeTaskId && (
							<TaskForm
								taskId={activeTaskId}
								isActive={true}
								togglePanel={() => setActivePanel(null)}
							/>
						)}
						{activePanel === PanelViews.AUTH && (
							<AuthForm
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
