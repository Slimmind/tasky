import { describe, it, expect, vi, beforeEach } from "vitest";
import { BoardType, TaskType } from "../utils/constants";

vi.mock("../services/firestore", () => ({
  createBoard: vi.fn().mockResolvedValue(undefined),
  updateBoardInfo: vi.fn().mockResolvedValue(undefined),
  saveTasks: vi.fn().mockResolvedValue(undefined),
  deleteBoard: vi.fn().mockResolvedValue(undefined),
}));

import * as firestore from "../services/firestore";
import { useBoardsStore } from "./boards.store";

const makeTask = (id: string, overrides: Partial<TaskType> = {}): TaskType => ({
  boardId: "b1",
  id,
  creationDate: 1,
  type: "backlog",
  title: `task ${id}`,
  isActive: false,
  subtasks: [],
  time: {
    estimation: "",
    estimationTime: 0,
    spentTime: 0,
    leftTime: 0,
    overTime: 0,
  },
  ...overrides,
});

const makeBoard = (tasks: TaskType[] = []): BoardType => ({
  id: "b1",
  title: "Board",
  color: "1, 2, 3",
  tasks,
});

beforeEach(() => {
  vi.clearAllMocks();
  useBoardsStore.setState({ boards: [], isLoading: false, error: null });
});

describe("boards store", () => {
  it("addBoard creates a board with id, empty tasks and createdAt", async () => {
    await useBoardsStore
      .getState()
      .addBoard({ title: "New", color: "1, 2, 3" }, "user-1");

    expect(firestore.createBoard).toHaveBeenCalledTimes(1);
    const [board, userId] = vi.mocked(firestore.createBoard).mock.calls[0];
    expect(userId).toBe("user-1");
    expect(board.id).toEqual(expect.any(String));
    expect(board.tasks).toEqual([]);
    expect(board.createdAt).toEqual(expect.any(Number));
  });

  it("updateBoard only touches title and description", async () => {
    await useBoardsStore
      .getState()
      .updateBoard("b1", { title: "Renamed", description: "d" });

    expect(firestore.updateBoardInfo).toHaveBeenCalledWith("b1", {
      title: "Renamed",
      description: "d",
    });
    expect(firestore.saveTasks).not.toHaveBeenCalled();
    expect(firestore.createBoard).not.toHaveBeenCalled();
  });

  it("updateTask replaces an existing task instead of duplicating it", async () => {
    useBoardsStore.setState({
      boards: [makeBoard([makeTask("t1"), makeTask("t2")])],
    });

    await useBoardsStore
      .getState()
      .updateTask("b1", makeTask("t1", { type: "done" }));

    const [boardId, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(boardId).toBe("b1");
    expect(tasks.map((t) => t.id)).toEqual(["t1", "t2"]);
    expect(tasks[0].type).toBe("done");
  });

  it("updateTask appends a new task", async () => {
    useBoardsStore.setState({ boards: [makeBoard([makeTask("t1")])] });

    await useBoardsStore.getState().updateTask("b1", makeTask("t2"));

    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(tasks.map((t) => t.id)).toEqual(["t1", "t2"]);
  });

  it("updateTask ignores unknown boards", async () => {
    await useBoardsStore.getState().updateTask("missing", makeTask("t1"));
    expect(firestore.saveTasks).not.toHaveBeenCalled();
  });

  it("removeTask removes only the requested task", async () => {
    useBoardsStore.setState({
      boards: [makeBoard([makeTask("t1"), makeTask("t2")])],
    });

    await useBoardsStore.getState().removeTask("b1", "t1");

    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(tasks.map((t) => t.id)).toEqual(["t2"]);
  });

  it("setBoards keeps references of unchanged boards and tasks", () => {
    const initial = [makeBoard([makeTask("t1"), makeTask("t2")])];
    useBoardsStore.getState().setBoards(initial);
    const before = useBoardsStore.getState().boards;

    // тот же контент, но новые объекты, как в новом snapshot
    useBoardsStore
      .getState()
      .setBoards(JSON.parse(JSON.stringify(initial)) as BoardType[]);
    expect(useBoardsStore.getState().boards[0]).toBe(before[0]);

    const changed = JSON.parse(JSON.stringify(initial)) as BoardType[];
    changed[0].tasks![1].title = "changed";
    useBoardsStore.getState().setBoards(changed);

    const after = useBoardsStore.getState().boards[0];
    expect(after).not.toBe(before[0]);
    expect(after.tasks![0]).toBe(before[0].tasks![0]);
    expect(after.tasks![1]).not.toBe(before[0].tasks![1]);
  });
});
