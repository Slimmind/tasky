import { lazy } from "react";
import { appColors, ColorOption } from "../../utils/constants";
import clsx from "clsx";
import { useEffect, useState } from "react";
import "./main-menu.styles.css";

const Button = lazy(() => import("../button"));
const Panel = lazy(() => import("../panel"));

type MainMenuProps = {
  isActive: boolean;
  togglePanel: () => void;
};

export const MainMenu = ({ isActive, togglePanel }: MainMenuProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [colorsMenu, setColorsMenu] = useState<ColorOption[]>([]);

  const changeColor = (color: string) => {
    document.documentElement.style.setProperty("--main-color-prop", color);

    const newColorIndex = appColors.findIndex(
      (appColor: string) => appColor === color,
    );

    const changedColors = colorsMenu.map(
      (colorOption: ColorOption, idx: number): ColorOption => ({
        ...colorOption,
        isActive: idx === newColorIndex,
      }),
    );

    setColorsMenu(changedColors);
    setIsMenuVisible(false);
  };

  const classes = clsx("main-menu", isMenuVisible && "main-menu--open");

  useEffect(() => {
    const colors = appColors.map((color: string, idx: number) => ({
      isActive: idx === 0,
      color,
    }));

    setColorsMenu(colors);
  }, []);

  return (
    <>
      <Button mod="icon menu" onClick={togglePanel} />
      <Panel isActive={isActive}>
        <div className={classes}>
          <section className="panel__section">
            <ul className="main-menu__colors">
              {colorsMenu.map((colorOption, idx) => (
                <li className="main-menu__colors-item" key={idx}>
                  <Button
                    mod="icon color"
                    activeClass={colorOption.isActive ? "active" : ""}
                    onClick={() => changeColor(colorOption.color)}
                    style={{
                      backgroundColor: `rgb(${colorOption.color})`,
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Panel>
    </>
  );
};
