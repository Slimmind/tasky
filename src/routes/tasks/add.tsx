import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/add")({
  validateSearch: (search: Record<string, unknown>) => ({
    boardId: typeof search.boardId === "string" ? search.boardId : undefined,
  }),
});
