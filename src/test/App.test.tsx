import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";

const firebaseAuth = vi.hoisted(() => ({
  currentUser: null as null | { uid: string; displayName: string },
  signOut: vi.fn(),
}));

vi.mock("../firebase", () => ({ auth: firebaseAuth, db: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, callback: (user: unknown) => void) => {
    callback(firebaseAuth.currentUser);
    return () => {};
  },
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock("../services/firestore", () => ({
  subscribeToBoards: (_uid: string, onUpdate: (boards: unknown[]) => void) => {
    onUpdate([{ id: "b1", title: "Мой проект", color: "1, 2, 3", tasks: [] }]);
    return () => {};
  },
  createBoard: vi.fn(),
  updateBoardInfo: vi.fn(),
  saveTasks: vi.fn(),
  deleteBoard: vi.fn(),
}));

import { App } from "../App";
import { createAppRouter } from "../router";

const renderApp = (path: string) => {
  const router = createAppRouter(
    createMemoryHistory({ initialEntries: [path] }),
  );
  render(
    <StrictMode>
      <App router={router} />
    </StrictMode>,
  );
  return router;
};

beforeEach(() => {
  firebaseAuth.currentUser = null;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("App", () => {
  it("shows the boards for a signed-in user without hitting the error boundary", async () => {
    firebaseAuth.currentUser = { uid: "u1", displayName: "Test" };
    const router = renderApp("/");

    expect(await screen.findByText("Мой проект")).toBeInTheDocument();
    expect(screen.queryByText(/Что-то пошло не так/)).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });

  it("redirects a guest to /signin and renders the sign-in form", async () => {
    const router = renderApp("/boards");

    expect(
      await screen.findByPlaceholderText("Адрес электронной почты"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Что-то пошло не так/)).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/signin");
  });
});
