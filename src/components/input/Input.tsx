import React, {
	forwardRef,
	InputHTMLAttributes,
	lazy,
	PropsWithChildren,
	SelectHTMLAttributes,
	TextareaHTMLAttributes,
} from 'react';
import clsx from 'clsx';
import './input.styles.css';

type BaseInputProps = {
    id: string;
    label?: string;
    description?: string;
    errorMessage?: string;
    containerClassName?: string;
};

const Textarea = lazy(() => import('./textarea'));
const Select = lazy(() => import('./select'));
const RadioButton = lazy(() => import('./radio-button'));
const Checkbox = lazy(() => import('./checkbox'));
const InputElement = lazy(() => import('./input-element'));

export const Input = forwardRef<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    BaseInputProps & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & SelectHTMLAttributes<HTMLSelectElement> & PropsWithChildren
>(({ id, label, type, children, description, errorMessage, ...props }, ref) => {
    const classes = clsx(
        'input',
        `input--${type}`,
        errorMessage && 'input--invalid',
        description && 'input--with-description'
    );

    switch (type) {
        case 'textarea':
            return (
                <Textarea
                    ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                    id={id}
                    label={label}
                    description={description}
                    errorMessage={errorMessage}
                    containerClassName={classes}
                    {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
                />
            );
        case 'select':
            return (
                <Select
                    ref={ref as React.ForwardedRef<HTMLSelectElement>}
                    id={id}
                    label={label}
                    description={description}
                    errorMessage={errorMessage}
                    containerClassName={classes}
                    {...props as SelectHTMLAttributes<HTMLSelectElement>}
                >
                    {children}
                </Select>
            );
        case 'radio':
            return (
                <RadioButton
                    ref={ref as React.ForwardedRef<HTMLInputElement>}
                    id={id}
                    label={label}
                    description={description}
                    errorMessage={errorMessage}
                    containerClassName={classes}
                    {...props as InputHTMLAttributes<HTMLInputElement>}
                />
            );
        case 'checkbox':
            return (
                <Checkbox
                    ref={ref as React.ForwardedRef<HTMLInputElement>}
                    id={id}
                    label={label}
                    description={description}
                    errorMessage={errorMessage}
                    containerClassName={classes}
                    {...props as InputHTMLAttributes<HTMLInputElement>}
                />
            );
        default:
            return (
                <InputElement
                    ref={ref as React.ForwardedRef<HTMLInputElement>}
                    id={id}
                    label={label}
                    type={type}
                    description={description}
                    errorMessage={errorMessage}
                    containerClassName={classes}
                    {...props as InputHTMLAttributes<HTMLInputElement>}
                />
            );
    }
});