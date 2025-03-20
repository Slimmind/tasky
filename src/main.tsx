import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TaskProvider } from './context/task.context.tsx';
import { PanelProvider } from './context/panel.context.tsx';
import { AuthProvider } from './context/auth.context.tsx';
import App from './App.tsx';
import { BoardsProvider } from './context/boards.context.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<BoardsProvider>
				<TaskProvider>
					<PanelProvider>
						<App />
					</PanelProvider>
				</TaskProvider>
			</BoardsProvider>
		</AuthProvider>
	</StrictMode>
);
