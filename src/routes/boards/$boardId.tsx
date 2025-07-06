import { createFileRoute } from '@tanstack/react-router';
import Tasks from '../../components/tasks';

export const Route = createFileRoute('/boards/$boardId')({
	component: RouteComponent,
});

function RouteComponent() {
	const { boardId } = Route.useParams();
	return <Tasks boardId={boardId} />;
}
