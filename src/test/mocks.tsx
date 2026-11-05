import { vi } from "vitest";
import type { ReactNode } from "react";

export const navigateMock = vi.fn();

export const routerMock = () => ({
  useNavigate: () => navigateMock,
  useRouter: () => ({
    history: { canGoBack: () => true, back: vi.fn() },
    navigate: navigateMock,
  }),
  Link: ({ children }: { children?: ReactNode }) => <a href="#">{children}</a>,
});

export const authMock = (uid: string | null = "user-1") => ({
  useAuth: () => ({ currentUser: uid ? { uid } : null }),
});
