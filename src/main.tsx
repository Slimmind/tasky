import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TaskProvider } from "./context/task.context.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </StrictMode>,
);
