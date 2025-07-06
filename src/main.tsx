import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { TaskProvider } from './context/task.context.tsx';
import { PanelProvider } from './context/panel.context.tsx';
import { AuthProvider } from './context/auth.context.tsx';
import { BoardsProvider } from './context/boards.context.tsx';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
// import App from './App.tsx';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<AuthProvider>
				<BoardsProvider>
					<TaskProvider>
						<PanelProvider>
							{/* <App /> */}
							<RouterProvider router={router}></RouterProvider>
						</PanelProvider>
					</TaskProvider>
				</BoardsProvider>
			</AuthProvider>
		</StrictMode>
	);
}

// createRoot(document.getElementById('root')!).render(
// 	<StrictMode>
// 		<AuthProvider>
// 			<BoardsProvider>
// 				<TaskProvider>
// 					<PanelProvider>
// 						<App />
// 					</PanelProvider>
// 				</TaskProvider>
// 			</BoardsProvider>
// 		</AuthProvider>
// 	</StrictMode>
// );
