import { createContext, ReactNode, useContext, useState } from 'react';
import { PanelTypes } from '../utils/constants';

type PanelContextType = {
  activePanel: PanelTypes;
  activeTaskId: string | null; // Тип string | null
  setActivePanel: (panel: PanelTypes, taskId?: string) => void; // taskId как string
};

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [activePanel, setActivePanel] = useState<PanelTypes>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleSetActivePanel = (panel: PanelTypes, taskId?: string) => {
    setActivePanel(panel);
    setActiveTaskId(taskId || null); // Устанавливаем taskId как string или null
  };

  return (
    <PanelContext.Provider
      value={{ activePanel, activeTaskId, setActivePanel: handleSetActivePanel }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
};