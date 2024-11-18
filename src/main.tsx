import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/auth.context';
import { FirestoreProvider } from './contexts/firestore.context.tsx';
import App from './App.tsx';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js')
			.then((registration) => {
				console.log('SW registered: ', registration);
			})
			.catch((registrationError) => {
				console.log('SW registration failed: ', registrationError);
			});
	});
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<FirestoreProvider>
				<App />
			</FirestoreProvider>
		</AuthProvider>
	</StrictMode>
);
