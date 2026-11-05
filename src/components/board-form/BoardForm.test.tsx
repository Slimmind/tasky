import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { navigateMock } from "../../test/mocks";

vi.mock("@tanstack/react-router", async () =>
  (await import("../../test/mocks")).routerMock(),
);
vi.mock("../../context/auth.context", async () =>
  (await import("../../test/mocks")).authMock(),
);
vi.mock("../../services/firestore", () => ({
  createBoard: vi.fn().mockResolvedValue(undefined),
  updateBoardInfo: vi.fn().mockResolvedValue(undefined),
  saveTasks: vi.fn().mockResolvedValue(undefined),
  deleteBoard: vi.fn(),
}));

import * as firestore from "../../services/firestore";
import { useBoardsStore } from "../../store/boards.store";
import { BoardForm } from "./BoardForm";

const submit = (container: HTMLElement) =>
  fireEvent.submit(container.querySelector("form")!);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardsStore.setState({
    boards: [
      {
        id: "b1",
        title: "Old",
        description: "old description",
        color: "10, 20, 30",
        tasks: [],
      },
    ],
    isLoading: false,
    error: null,
  });
});

describe("BoardForm", () => {
  it("edits only title and description, leaving tasks and color alone", async () => {
    const { container } = render(<BoardForm boardId="b1" />);

    const title = await screen.findByDisplayValue("Old");
    fireEvent.change(title, { target: { value: "Renamed" } });
    submit(container);

    await waitFor(() =>
      expect(firestore.updateBoardInfo).toHaveBeenCalledWith("b1", {
        title: "Renamed",
        description: "old description",
      }),
    );
    expect(firestore.createBoard).not.toHaveBeenCalled();
    expect(firestore.saveTasks).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });

  it("creates a board with a color in the 'r, g, b' format", async () => {
    const { container } = render(<BoardForm />);

    fireEvent.change(screen.getByPlaceholderText("Заголовок..."), {
      target: { value: "Brand new" },
    });
    submit(container);

    await waitFor(() => expect(firestore.createBoard).toHaveBeenCalledTimes(1));
    const [board, userId] = vi.mocked(firestore.createBoard).mock.calls[0];
    expect(userId).toBe("user-1");
    expect(board.title).toBe("Brand new");
    expect(board.color).toMatch(/^\d+, \d+, \d+$/);
    expect(board.tasks).toEqual([]);
  });

  it("does not create a board with a blank title", () => {
    const { container } = render(<BoardForm />);
    fireEvent.change(screen.getByPlaceholderText("Заголовок..."), {
      target: { value: "  " },
    });
    submit(container);

    expect(firestore.createBoard).not.toHaveBeenCalled();
  });

  it("shows a message for an unknown board", () => {
    render(<BoardForm boardId="missing" />);
    expect(screen.getByText("Проект не найден")).toBeInTheDocument();
  });
});
