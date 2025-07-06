import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	// const navigate = useNavigate();
	// navigate({ to: '/boards' });
	return (
		<h1>
			<Link to='/boards'>go to BOARDS</Link>
		</h1>
	);
}
