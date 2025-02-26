import { useState, lazy, Suspense } from "react";
import { PanelTypes } from "./utils/constants";
// import { useTasks } from "./context/task.context";
import "./index.css";
import ErrorBoundary from "./components/error-boundary";

const SiteHeader = lazy(() => import("./components/site-header"));
const SiteFooter = lazy(() => import("./components/site-footer"));
// const Welcome = lazy(() => import("./components/welcome"));
const Tasks = lazy(() => import("./components/tasks"));

function App() {
  const [activePanel, setActivePanel] = useState<PanelTypes>(null);
  // const { tasks } = useTasks();

  return (
    <>
    <Suspense fallback={<div>Загрузка...</div>}>
      <SiteHeader />
      <ErrorBoundary>
        {/* <main>{tasks.length > 0 ? <Tasks /> : <Welcome />}</main> */}
        <main><Tasks /></main>
      </ErrorBoundary>
      <SiteFooter activePanel={activePanel} handlePanel={setActivePanel} />
    </Suspense>
    </>
  );
}

export default App;
