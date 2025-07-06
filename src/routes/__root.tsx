import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';
import '../index.css';

export const Route = createRootRoute({
	component: () => (
		<>
			<SiteHeader />
			<main>
				<Outlet />
				<TanStackRouterDevtools />
			</main>
			<SiteFooter />
		</>
	),
});
