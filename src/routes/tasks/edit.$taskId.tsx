import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/edit/$taskId")({
  validateSearch: (search: Record<string, unknown>) => ({
    boardId: typeof search.boardId === "string" ? search.boardId : undefined,
  }),
});
