import React, {
	forwardRef,
	InputHTMLAttributes,
	PropsWithChildren,
	TextareaHTMLAttributes,
} from 'react';
import './input.styles.css';

type InputProps = {
	label?: string;
	id?: string;
	type?: string;
} & InputHTMLAttributes<HTMLInputElement> &
	TextareaHTMLAttributes<HTMLTextAreaElement> &
	PropsWithChildren;

export const Input = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputProps
>(({ id, label, type, children, ...props }, ref) => {
	const InputElement = type === 'textarea' ? 'textarea' : 'input';

	return (
		<div className='input'>
			{label && <label htmlFor={id}>{label}</label>}
			<div className='input__wrap'>
				{React.createElement(InputElement, {
					ref: ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>,
					type: type || 'text',
					id,
					...props,
				})}
				{children}
			</div>
			{/* {message && <p className='message message'></p>} */}
		</div>
	);
});
