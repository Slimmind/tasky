import { create } from "zustand";
import { nanoid } from "nanoid";
import { BoardType, TaskType } from "../utils/constants";
import {
  createBoard,
  updateBoardInfo,
  saveTasks,
  deleteBoard,
} from "../services/firestore";

interface BoardsState {
  boards: BoardType[];
  isLoading: boolean;
  error: string | null;
  setBoards: (boards: BoardType[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addBoard: (board: Omit<BoardType, "id">, userId: string) => Promise<void>;
  updateBoard: (
    id: string,
    fields: Pick<BoardType, "title" | "description">,
  ) => Promise<void>;
  removeBoard: (id: string) => Promise<void>;
  updateTask: (boardId: string, task: TaskType) => Promise<void>;
  removeTask: (boardId: string, taskId: string) => Promise<void>;
}

const isSame = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

// Каждый snapshot Firestore отдаёт новые объекты, из-за чего перерисовывается
// всё дерево. Сохраняем прежние ссылки для неизменившихся досок и заданий.
const shareUnchanged = (
  prevBoards: BoardType[],
  nextBoards: BoardType[],
): BoardType[] =>
  nextBoards.map((next) => {
    const prev = prevBoards.find((board) => board.id === next.id);
    if (!prev) return next;
    if (isSame(prev, next)) return prev;
    return {
      ...next,
      tasks: next.tasks?.map((task) => {
        const prevTask = prev.tasks?.find((item) => item.id === task.id);
        return prevTask && isSame(prevTask, task) ? prevTask : task;
      }),
    };
  });

export const useBoardsStore = create<BoardsState>((set, get) => ({
  boards: [],
  isLoading: true,
  error: null,
  setBoards: (boards) =>
    set((state) => ({ boards: shareUnchanged(state.boards, boards) })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addBoard: async (board, userId) => {
    const newBoard: BoardType = {
      tasks: [],
      createdAt: Date.now(),
      ...board,
      id: nanoid(),
    };
    await createBoard(newBoard, userId);
  },

  updateBoard: async (id, fields) => {
    await updateBoardInfo(id, fields);
  },

  removeBoard: async (id) => {
    await deleteBoard(id);
  },

  updateTask: async (boardId, updatedTask) => {
    const board = get().boards.find((b) => b.id === boardId);
    if (!board) return;

    const tasks = board.tasks ?? [];
    const newTasks = tasks.some((t) => t.id === updatedTask.id)
      ? tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      : [...tasks, updatedTask];

    await saveTasks(boardId, newTasks);
  },

  removeTask: async (boardId, taskId) => {
    const board = get().boards.find((b) => b.id === boardId);
    if (!board) return;

    await saveTasks(
      boardId,
      (board.tasks ?? []).filter((t) => t.id !== taskId),
    );
  },
}));
