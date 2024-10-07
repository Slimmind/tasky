import { lazy } from "react";
import { PanelTypes } from "../../utils/constants";
import "./site-footer.styles.css";

const Add = lazy(() => import("../add"));
const MainMenu = lazy(() => import("../main-menu"));
const Search = lazy(() => import("../search"));

type SiteFooterProps = {
  activePanel: string | null;
  handlePanel: (panel: PanelTypes) => void;
};

export const SiteFooter = ({ activePanel, handlePanel }: SiteFooterProps) => {
  return (
    <footer className="site-footer">
      <Search
        isActive={activePanel === "search"}
        togglePanel={() =>
          handlePanel(activePanel === "search" ? null : "search")
        }
      />
      <MainMenu
        isActive={activePanel === "menu"}
        togglePanel={() => handlePanel(activePanel === "menu" ? null : "menu")}
      />
      <Add
        isActive={activePanel === "add"}
        togglePanel={() => handlePanel(activePanel === "add" ? null : "add")}
      />
    </footer>
  );
};
