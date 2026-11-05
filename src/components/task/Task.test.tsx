import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TaskType } from "../../utils/constants";

vi.mock("@tanstack/react-router", async () =>
  (await import("../../test/mocks")).routerMock(),
);
vi.mock("../../services/firestore", () => ({
  createBoard: vi.fn(),
  updateBoardInfo: vi.fn(),
  saveTasks: vi.fn().mockResolvedValue(undefined),
  deleteBoard: vi.fn(),
}));

import * as firestore from "../../services/firestore";
import { useBoardsStore } from "../../store/boards.store";
import { Task } from "./Task";

const makeTask = (id: string, overrides: Partial<TaskType> = {}): TaskType => ({
  boardId: "b1",
  id,
  creationDate: 1,
  type: "backlog",
  title: `Task ${id}`,
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

const first = makeTask("t1");
const second = makeTask("t2", {
  subtasks: [
    { id: "s1", value: "step one", checked: false },
    { id: "s2", value: "step two", checked: true },
  ],
});

beforeEach(() => {
  vi.clearAllMocks();
  useBoardsStore.setState({
    boards: [
      { id: "b1", title: "Board", color: "1, 2, 3", tasks: [first, second] },
    ],
    isLoading: false,
    error: null,
  });
});

describe("Task", () => {
  it("moves the task whose button was clicked, not the first one rendered", () => {
    render(
      <ul>
        <Task data={first} />
        <Task data={second} />
      </ul>,
    );

    const secondItem = document.getElementById("t2")!;
    fireEvent.click(
      within(secondItem).getByLabelText("switch task type to todo"),
    );

    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(tasks.find((t) => t.id === "t1")!.type).toBe("backlog");
    expect(tasks.find((t) => t.id === "t2")!.type).toBe("todo");
  });

  it("toggles only the clicked subtask", () => {
    render(
      <ul>
        <Task data={second} />
      </ul>,
    );

    fireEvent.click(screen.getByText("step one"));

    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    const subtasks = tasks.find((t) => t.id === "t2")!.subtasks;
    expect(subtasks.map((s) => s.checked)).toEqual([true, true]);
  });

  it("reflects checked state from data without writing on its own", () => {
    const { rerender } = render(
      <ul>
        <Task data={second} />
      </ul>,
    );
    expect(screen.getByText("step one")).toHaveAttribute(
      "aria-checked",
      "false",
    );

    // например, подзадачу отметили на другом устройстве
    const updated = {
      ...second,
      subtasks: second.subtasks.map((s) => ({ ...s, checked: true })),
    };
    rerender(
      <ul>
        <Task data={updated} />
      </ul>,
    );

    expect(screen.getByText("step one")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(firestore.saveTasks).not.toHaveBeenCalled();
  });

  it("only offers deletion for done tasks", () => {
    const { rerender } = render(
      <ul>
        <Task data={first} />
      </ul>,
    );
    expect(screen.queryByLabelText("delete task")).not.toBeInTheDocument();

    rerender(
      <ul>
        <Task data={{ ...first, type: "done" }} />
      </ul>,
    );
    fireEvent.click(screen.getByLabelText("delete task"));
    const [, tasks] = vi.mocked(firestore.saveTasks).mock.calls[0];
    expect(tasks.map((t) => t.id)).toEqual(["t2"]);
  });
});
