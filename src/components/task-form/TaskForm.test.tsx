import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BoardType, TaskType } from "../../utils/constants";
import { navigateMock } from "../../test/mocks";

vi.mock("@tanstack/react-router", async () =>
  (await import("../../test/mocks")).routerMock(),
);
vi.mock("../../context/auth.context", async () =>
  (await import("../../test/mocks")).authMock(),
);
vi.mock("../../services/firestore", () => ({
  createBoard: vi.fn(),
  updateBoardInfo: vi.fn(),
  saveTasks: vi.fn().mockResolvedValue(undefined),
  deleteBoard: vi.fn(),
}));

import * as firestore from "../../services/firestore";
import { useBoardsStore } from "../../store/boards.store";
import { TaskForm } from "./TaskForm";

const existingTask: TaskType = {
  boardId: "b1",
  id: "t1",
  creationDate: 123,
  type: "inProgress",
  title: "Old title",
  description: "desc",
  isActive: false,
  subtasks: [{ id: "s1", value: "step", checked: true }],
  time: {
    estimation: "1d",
    estimationTime: 480,
    spentTime: 30,
    leftTime: 0,
    overTime: 0,
  },
};

const board: BoardType = {
  id: "b1",
  title: "Board",
  color: "1, 2, 3",
  tasks: [existingTask],
};

const submit = (container: HTMLElement) =>
  fireEvent.submit(container.querySelector("form")!);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardsStore.setState({ boards: [board], isLoading: false, error: null });
});

describe("TaskForm", () => {
  it("edits the existing task instead of creating a duplicate", async () => {
    const { container } = render(<TaskForm boardId="b1" taskId="t1" />);

    const title = await screen.findByDisplayValue("Old title");
    fireEvent.change(title, { target: { value: "New title" } });
    submit(container);

    await waitFor(() => expect(firestore.saveTasks).toHaveBeenCalledTimes(1));
    const [boardId, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(boardId).toBe("b1");
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      id: "t1",
      title: "New title",
      type: "inProgress",
      creationDate: 123,
    });
    expect(tasks[0].time.spentTime).toBe(30);
    expect(tasks[0].subtasks[0].checked).toBe(true);
    expect(navigateMock).toHaveBeenCalled();
  });

  it("creates a new backlog task on the given board", async () => {
    const { container } = render(<TaskForm boardId="b1" />);

    fireEvent.change(await screen.findByPlaceholderText("Заголовок..."), {
      target: { value: "Fresh task" },
    });
    submit(container);

    await waitFor(() => expect(firestore.saveTasks).toHaveBeenCalledTimes(1));
    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(tasks).toHaveLength(2);
    expect(tasks[1]).toMatchObject({
      boardId: "b1",
      title: "Fresh task",
      type: "backlog",
      subtasks: [],
    });
    expect(tasks[1].id).not.toBe("t1");
  });

  it("does not save a task with a blank title", async () => {
    const { container } = render(<TaskForm boardId="b1" />);
    fireEvent.change(await screen.findByPlaceholderText("Заголовок..."), {
      target: { value: "   " },
    });
    submit(container);

    expect(firestore.saveTasks).not.toHaveBeenCalled();
  });

  it("keeps filled subtasks even when the first one is empty", async () => {
    const { container } = render(<TaskForm boardId="b1" />);

    fireEvent.change(await screen.findByPlaceholderText("Заголовок..."), {
      target: { value: "With steps" },
    });
    fireEvent.click(screen.getByLabelText("add subtask"));
    fireEvent.change(screen.getByPlaceholderText("Подзадача-2"), {
      target: { value: "second step" },
    });
    submit(container);

    await waitFor(() => expect(firestore.saveTasks).toHaveBeenCalled());
    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(tasks[1].subtasks.map((s) => s.value)).toEqual(["second step"]);
  });

  it("shows a message instead of a form for an unknown board", () => {
    render(<TaskForm boardId="missing" />);
    expect(screen.getByText("Проект не найден")).toBeInTheDocument();
  });

  it("shows a message for an unknown task", () => {
    render(<TaskForm boardId="b1" taskId="missing" />);
    expect(screen.getByText("Задание не найдено")).toBeInTheDocument();
  });
});
