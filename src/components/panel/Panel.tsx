import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import './panel.styles.css';
import getMod from '../../utils/get-mod';

type PanelProps = {
	filled?: boolean;
	isActive?: boolean;
	title?: string;
	mod?: string;
} & PropsWithChildren;

export const Panel = ({
	filled = true,
	children,
	isActive,
	title,
	mod,
}: PanelProps) => {
	const classes = clsx(
		'panel',
		filled && 'panel--filled',
		isActive && 'panel--opened',
		mod && getMod('panel', mod)
	);

	const panelHeader = title ? (
		<header className='panel__header'>{title}</header>
	) : (
		''
	);

	return (
		<div className={classes}>
			{panelHeader}
			{children}
		</div>
	);
};
