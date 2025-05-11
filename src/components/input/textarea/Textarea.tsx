import {
    forwardRef,
    lazy,
    TextareaHTMLAttributes,
} from 'react';

const WarningIcon = lazy(() => import('../../../icons/warning-icon'));

type BaseInputProps = {
    id: string;
    label?: string;
    description?: string;
    errorMessage?: string;
    containerClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ id, label, description, errorMessage, containerClassName, ...props }, ref) => {
        return (
            <div className={containerClassName}>
                {label && <label htmlFor={id}>{label}</label>}
                <div className="input__wrap">
                    <textarea ref={ref} id={id} {...props} />
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