import { createLazyFileRoute } from '@tanstack/react-router';
import BoardForm from '../../components/board-form';

export const Route = createLazyFileRoute('/boards/add')({
	component: RouteComponent,
});

function RouteComponent() {
	return <BoardForm />;
}
