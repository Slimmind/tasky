import { createLazyFileRoute } from "@tanstack/react-router";
import TaskForm from "../../components/task-form";

export const Route = createLazyFileRoute("/tasks/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId } = Route.useSearch();
  return <TaskForm boardId={boardId} />;
}
