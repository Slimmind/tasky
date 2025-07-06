import { createFileRoute } from '@tanstack/react-router';
import Boards from '../components/boards';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	// const navigate = useNavigate();
	// navigate({ to: '/boards' });
	return (
		// <h1>
		// 	<Link to='/boards'>go to BOARDS</Link>
		// </h1>
		<Boards />
	);
}
