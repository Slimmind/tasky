import { appColors, ColorOption } from '../../utils/constants';
import clsx from 'clsx';
import Button from '../button';
import './main-menu.styles.css';
import { useEffect, useState } from 'react';
import Panel from '../panel';

export const MainMenu = () => {
	const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
	const [colorsMenu, setColorsMenu] = useState<ColorOption[]>([]);

	const toggleMenu = (): void => {
		setIsMenuVisible((prev) => !prev);
	};

	const changeColor = (color: string) => {
		document.documentElement.style.setProperty('--main-color-prop', color);

		const newColorIndex = appColors.findIndex(
			(appColor: string) => appColor === color
		);

		const changedColors = colorsMenu.map(
			(colorOption: ColorOption, idx: number): ColorOption => ({
				...colorOption,
				isActive: idx === newColorIndex,
			})
		);

		setColorsMenu(changedColors);
		setIsMenuVisible(false);
	};

	const classes = clsx('main-menu', isMenuVisible && 'main-menu--open');

	useEffect(() => {
		const colors = appColors.map((color: string, idx: number) => ({
			isActive: idx === 0,
			color,
		}));

		setColorsMenu(colors);
	}, []);

	return (
		<>
			<Button mod='menu' onClick={toggleMenu} />
			<Panel isActive={isMenuVisible}>
				<div className={classes}>
					<section className='panel__section'>
						<ul className='main-menu__colors'>
							{colorsMenu.map((colorOption, idx) => (
								<li className='main-menu__colors-item' key={idx}>
									<Button
										mod='color'
										activeClass={colorOption.isActive ? 'active' : ''}
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
