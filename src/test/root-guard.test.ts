import { describe, it, expect, vi, beforeEach } from "vitest";

const authState = vi.hoisted(() => ({
  currentUser: null as null | { uid: string },
}));
vi.mock("../firebase", () => ({ auth: authState }));

import { Route } from "../routes/__root";

const runGuard = (pathname: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Route.options.beforeLoad as any)({ location: { pathname } });

const catchThrown = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
};

beforeEach(() => {
  authState.currentUser = null;
});

describe("root route guard", () => {
  it("redirects guests to /signin", () => {
    const thrown = catchThrown(() => runGuard("/boards")) as {
      options?: { to?: string };
    };
    expect(thrown?.options?.to).toBe("/signin");
  });

  it("lets guests open /signin", () => {
    expect(catchThrown(() => runGuard("/signin"))).toBeUndefined();
  });

  it("lets signed-in users through", () => {
    authState.currentUser = { uid: "user-1" };
    expect(catchThrown(() => runGuard("/boards"))).toBeUndefined();
  });
});
