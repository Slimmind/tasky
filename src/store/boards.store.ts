import { create } from "zustand";
import { BoardType, TaskType } from "../utils/constants";
import {
  saveBoard,
  deleteBoard as deleteBoardService,
} from "../services/firestore";
import { nanoid } from "nanoid";

interface BoardsState {
  boards: BoardType[];
  isLoading: boolean;
  setBoards: (boards: BoardType[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  addBoard: (board: Omit<BoardType, "id">, userId: string) => Promise<void>;
  removeBoard: (id: string) => Promise<void>;
  updateTask: (
    boardId: string,
    task: TaskType,
    userId: string,
  ) => Promise<void>;
  removeTask: (
    boardId: string,
    taskId: string,
    userId: string,
  ) => Promise<void>;
  changeBoard: (id: string, board: BoardType, userId: string) => Promise<void>;
}

export const useBoardsStore = create<BoardsState>((set, get) => ({
  boards: [],
  isLoading: true,
  setBoards: (boards) => set({ boards }),
  setIsLoading: (isLoading) => set({ isLoading }),

  addBoard: async (board, userId) => {
    const newBoard: BoardType = { id: nanoid(), tasks: [], ...board };
    await saveBoard(newBoard, userId);
  },

  removeBoard: async (id) => {
    await deleteBoardService(id);
  },

  changeBoard: async (_id, updatedBoard, userId) => {
    await saveBoard(updatedBoard, userId);
  },

  updateTask: async (boardId, updatedTask, userId) => {
    const { boards } = get();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    // If task is not in the list (e.g. new task), add it?
    // The current logic in Task.tsx implies it replaces or adds?
    // Actually Task.tsx logic was: filter out old, add new.
    // Let's stick to "update" meaning "replace existing".
    // But wait, Task.tsx logic was:
    // tasks: [...(currentBoard.tasks?.filter(...) || []), updatedTask]
    // This handles both update and move (if we were moving, but here it's just update).

    // Let's refine update logic to be robust.
    const tasks = board.tasks || [];
    const taskExists = tasks.some((t) => t.id === updatedTask.id);
    let newTasks;
    if (taskExists) {
      newTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    } else {
      newTasks = [...tasks, updatedTask];
    }

    const finalBoard = { ...board, tasks: newTasks };
    await saveBoard(finalBoard, userId);
  },

  removeTask: async (boardId, taskId, userId) => {
    const { boards } = get();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    const tasks = board.tasks || [];
    const updatedBoard = {
      ...board,
      tasks: tasks.filter((t) => t.id !== taskId),
    };
    await saveBoard(updatedBoard, userId);
  },
}));
