import { createContext } from 'react';
import { PanelTypes } from '../utils/constants';

type PanelContextType = {
	activePanel: string;
	setActivePanel: (panel: PanelTypes) => void;
};

const PanelContext = createContext<PanelContextType>(undefined);
