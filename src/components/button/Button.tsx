import { ComponentPropsWithoutRef } from 'react';
import getMod from '../../utils/get-mod';
import './button.styles.css';

type CommonProps = {
	mod?: string;
	actionClass?: string;
};

type ButtonProps = ComponentPropsWithoutRef<'button'> &
	CommonProps & {
		href?: never;
	};

type AnchorProps = ComponentPropsWithoutRef<'a'> &
	CommonProps & {
		href: string;
	};

type Props = ButtonProps | AnchorProps;

const isAnchorProps = (props: Props): props is AnchorProps => 'href' in props;

export const Button = (props: Props) => {
	const { mod, actionClass, ...restProps } = props;
	const classes = `btn ${mod && getMod('btn', mod)} ${
		actionClass ? getMod('btn', actionClass) : ''
	}`;

	if (isAnchorProps(props)) {
		const { href, ...anchorProps } = restProps as AnchorProps;
		return <a className={classes} href={href} {...anchorProps}></a>;
	} else {
		const { type, ...buttonProps } = restProps as ButtonProps;
		return (
			<button
				className={classes}
				type={type || 'button'}
				{...buttonProps}
			></button>
		);
	}
};
