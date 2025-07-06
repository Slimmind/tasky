import { createLazyFileRoute } from '@tanstack/react-router';
import TaskForm from '../../components/task-form';


interface TaskAddSearch {
  boardId?: string;
}

export const Route = createLazyFileRoute('/tasks/edit/$taskId')({
	component: RouteComponent,
});

function RouteComponent() {
	const { taskId } = Route.useParams();
  const search = Route.useSearch() as TaskAddSearch;
	return <TaskForm taskId={taskId} boardId={search?.boardId} />;
}
