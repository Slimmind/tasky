import { createLazyFileRoute } from '@tanstack/react-router';
import TaskForm from '../../components/task-form';

interface TaskAddSearch {
  boardId?: string;
}

export const Route = createLazyFileRoute('/tasks/add')({
	component: RouteComponent,
});

function RouteComponent() {
const search = Route.useSearch() as TaskAddSearch;
	return <TaskForm boardId={search?.boardId} />;
}
