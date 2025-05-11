import {
    forwardRef,
    lazy,
    PropsWithChildren,
    SelectHTMLAttributes
} from 'react';
import './input.styles.css';

const WarningIcon = lazy(() => import('../../../icons/warning-icon'));

type BaseInputProps = {
    id: string;
    label?: string;
    description?: string;
    errorMessage?: string;
    containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, BaseInputProps & SelectHTMLAttributes<HTMLSelectElement> & PropsWithChildren>(
    ({ id, label, description, errorMessage, containerClassName, children, ...props }, ref) => {
        return (
            <div className={containerClassName}>
                {label && <label htmlFor={id}>{label}</label>}
                <div className="input__wrap">
                    <select ref={ref} id={id} {...props}>
                        {children}
                    </select>
                    {description && <p className="input__description">{description}</p>}
                    {errorMessage && (
                        <p className="input__error-message">
                            <WarningIcon />
                            {errorMessage}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);