import { useState } from 'react';
import { PanelTypes } from './utils/constants';
import { useAuth } from './contexts/auth.context';
import Tasks from './components/tasks';
import SiteHeader from './components/site-header';
import SiteFooter from './components/site-footer';
import './index.css';

function App() {
  const { currentUser } = useAuth();
  const [activePanel, setActivePanel] = useState<PanelTypes>(null);

  return (
    <>
      <SiteHeader activePanel={activePanel} handlePanel={setActivePanel} />
      <main>{currentUser?.uid && <Tasks />}</main>
      <SiteFooter activePanel={activePanel} handlePanel={setActivePanel} />
    </>
  );
}

export default App;
