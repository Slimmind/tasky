import { useState, lazy } from "react";
import { PanelTypes } from "./utils/constants";
import { useAuth } from "./contexts/auth.context";
import "./index.css";

const SiteHeader = lazy(() => import("./components/site-header"));
const SiteFooter = lazy(() => import("./components/site-footer"));
const Welcome = lazy(() => import("./components/welcome"));
const Tasks = lazy(() => import("./components/tasks"));

function App() {
  const { currentUser } = useAuth();
  const [activePanel, setActivePanel] = useState<PanelTypes>(null);

  return (
    <>
      <SiteHeader activePanel={activePanel} handlePanel={setActivePanel} />
      <main>{currentUser?.uid ? <Tasks /> : <Welcome />}</main>
      <SiteFooter activePanel={activePanel} handlePanel={setActivePanel} />
    </>
  );
}

export default App;
