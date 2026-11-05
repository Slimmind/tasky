import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { auth } from "../firebase";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import { AuthWatcher } from "../components/AuthWatcher";
import "../index.css";

export const Route = createRootRoute({
  // AuthProvider не рендерит приложение, пока Firebase не определил пользователя,
  // поэтому auth.currentUser здесь уже актуален.
  beforeLoad: ({ location }) => {
    if (!auth.currentUser && location.pathname !== "/signin") {
      throw redirect({ to: "/signin" });
    }
  },
  component: () => (
    <>
      <AuthWatcher />
      <SiteHeader />
      <main>
        <Outlet />
        <TanStackRouterDevtools />
      </main>
      <SiteFooter />
    </>
  ),
});
