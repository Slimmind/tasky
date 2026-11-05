import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./context/auth.context";
import { StoreInitializer } from "./components/StoreInitializer";
import ErrorBoundary from "./components/error-boundary";
import { createAppRouter } from "./router";

type AppProps = {
  router: ReturnType<typeof createAppRouter>;
};

export const App = ({ router }: AppProps) => (
  <ErrorBoundary>
    <AuthProvider>
      <StoreInitializer />
      <RouterProvider router={router} />
    </AuthProvider>
  </ErrorBoundary>
);
