import { createFileRoute } from '@tanstack/react-router';
import BoardForm from '../components/board-form';

export const Route = createFileRoute('/edit-board/$boardId')({
	component: RouteComponent,
});

function RouteComponent() {
	const { boardId } = Route.useParams();
	return <BoardForm boardId={boardId} />;
}
