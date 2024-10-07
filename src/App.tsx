import { lazy } from "react";
// import { useAuth } from './contexts/auth.context';
import { useState } from "react";
import { PanelTypes } from "./utils/constants";
import "./index.css";

const SiteHeader = lazy(() => import("./components/site-header"));
const SiteFooter = lazy(() => import("./components/site-footer"));

function App() {
  // const { currentUser, login, signup, loginWithGoogle, logout } = useAuth();
  const [activePanel, setActivePanel] = useState<PanelTypes>(null);

  return (
    <>
      <SiteHeader activePanel={activePanel} handlePanel={setActivePanel} />
      <main></main>
      <SiteFooter activePanel={activePanel} handlePanel={setActivePanel} />
    </>
  );
}

export default App;
