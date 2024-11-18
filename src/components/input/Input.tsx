import React, {
	forwardRef,
	InputHTMLAttributes,
	lazy,
	PropsWithChildren,
	TextareaHTMLAttributes,
} from 'react';
import clsx from 'clsx';
import './input.styles.css';

const WarningIcon = lazy(() => import('../../icons/warning-icon'));

type InputProps = {
	id: string;
	label?: string;
	type?: string;
	description?: string;
	errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement> &
	TextareaHTMLAttributes<HTMLTextAreaElement> &
	PropsWithChildren;

export const Input = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputProps
>(({ id, label, type, children, description, errorMessage, ...props }, ref) => {
	const InputElement = type === 'textarea' ? 'textarea' : 'input';

	const isChecking = type === 'radio' || type === 'checkbox';
	const classes = clsx(
		'input',
		`input--${type}`,
		errorMessage && 'input--invalid',
		description && 'input--with-description'
	);

	return (
		<div className={classes}>
			{!isChecking && label && <label htmlFor={id}>{label}</label>}
			<div className='input__wrap'>
				{React.createElement(InputElement, {
					ref: ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>,
					type: type || 'text',
					id,
					...props,
				})}
				{isChecking && label && <label htmlFor={id}>{label}</label>}
				{children}
			</div>
			{description && <p className='input__description'>{description}</p>}
			{errorMessage && (
				<p className='input__error-message'>
					<WarningIcon />
					{errorMessage}
				</p>
			)}
		</div>
	);
});
