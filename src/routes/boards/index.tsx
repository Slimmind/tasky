import { createFileRoute } from '@tanstack/react-router';
import Boards from '../../components/boards';

export const Route = createFileRoute('/boards/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Boards />;
}
