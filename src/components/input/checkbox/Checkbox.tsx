import {
    forwardRef,
    InputHTMLAttributes,
    lazy,
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

export const Checkbox = forwardRef<HTMLInputElement, BaseInputProps & InputHTMLAttributes<HTMLInputElement>>(
    ({ id, label, description, errorMessage, containerClassName, ...props }, ref) => {
        return (
            <div className={containerClassName}>
                <div className="input__wrap">
                    <input ref={ref} type="checkbox" id={id} {...props} />
                    {label && <label htmlFor={id}>{label}</label>}
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