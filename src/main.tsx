import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { createAppRouter } from "./router";

const router = createAppRouter();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App router={router} />
    </StrictMode>,
  );
}
