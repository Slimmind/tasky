import './error-message.style.css';

type ErrorMessageProps = {
	message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
	return <div className='error-message'>{message}</div>;
};
