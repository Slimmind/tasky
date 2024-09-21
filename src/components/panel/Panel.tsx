import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import './panel.styles.css';

type PanelProps = {
	filled?: boolean;
	isActive?: boolean;
	title?: string;
} & PropsWithChildren;

export const Panel = ({
	filled = true,
	children,
	isActive,
	title,
}: PanelProps) => {
	const classes = clsx(
		'panel',
		filled && 'panel--filled',
		isActive && 'panel--opened'
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
