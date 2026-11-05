import { createLazyFileRoute } from "@tanstack/react-router";
import TaskForm from "../../components/task-form";

export const Route = createLazyFileRoute("/tasks/edit/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();
  const { boardId } = Route.useSearch();
  return <TaskForm taskId={taskId} boardId={boardId} />;
}
