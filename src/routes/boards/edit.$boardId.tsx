import { createFileRoute } from '@tanstack/react-router';
import BoardForm from '../../components/board-form';

export const Route = createFileRoute('/boards/edit/$boardId')({
	component: RouteComponent,
});

function RouteComponent() {
	const { boardId } = Route.useParams();
	return <BoardForm boardId={boardId} />;
}
