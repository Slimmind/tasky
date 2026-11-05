import { createRouter, RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFound from "./components/not-found";
import RouteError from "./components/route-error";
import Preloader from "./components/preloader";

export const createAppRouter = (history?: RouterHistory) =>
  createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: RouteError,
    defaultPendingComponent: Preloader,
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
