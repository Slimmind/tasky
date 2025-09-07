import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/auth.context.tsx';
import { BoardsProvider } from './context/boards.context.tsx';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<AuthProvider>
				<BoardsProvider>
					<RouterProvider router={router}></RouterProvider>
				</BoardsProvider>
			</AuthProvider>
		</StrictMode>
	);
}
