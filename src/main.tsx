import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TaskProvider } from "./context/task.context.tsx";
import { PanelProvider } from "./context/panel.context.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <PanelProvider>
        <App />
      </PanelProvider>
    </TaskProvider>
  </StrictMode>,
);
