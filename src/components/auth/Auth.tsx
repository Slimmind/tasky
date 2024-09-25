import { FormEvent, useRef, useState } from 'react';
import Button from '../button';
import Panel from '../panel';
import Input from '../input';
import { useAuth } from '../../contexts/auth.context';
import './auth.styles.css';
import { FormViews } from '../../utils/constants';

export const Auth = () => {
	const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

	const toggleMenu = (): void => {
		setIsMenuVisible((prev) => !prev);
	};

	const { login, sign_up } = useAuth();
	const [error, setError] = useState('');
	const [formView, setFormView] = useState(FormViews.LOGIN);
	const [loading, setLoading] = useState(false);

	const emailRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const passwordRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const passwordConfirmationRef = useRef<
		HTMLInputElement | HTMLTextAreaElement
	>(null);

	const toggleFormView = () => {
		setFormView((prev) =>
			prev === FormViews.LOGIN ? FormViews.SIGN_UP : FormViews.LOGIN
		);
	};

	const submitButtonText =
		formView === FormViews.LOGIN ? 'Log In' : 'Create An Account';

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (emailRef.current?.value && passwordRef.current?.value) {
			if (formView === FormViews.LOGIN) {
				try {
					setError('');
					await login(emailRef.current?.value, passwordRef.current?.value);
				} catch {
					setError('Failed to log in');
				}
			} else {
				if (
					passwordRef.current?.value !== passwordConfirmationRef.current?.value
				) {
					return setError('Passwords do not match');
				}

				try {
					setError('');
					setLoading(true);
					await sign_up(emailRef.current?.value, passwordRef.current?.value);
					setFormView(FormViews.LOGIN);
				} catch {
					setError('Failed to crete an account');
				}
				setLoading(false);
			}
		}
	}

	return (
		<>
			<Button mod='icon auth' onClick={toggleMenu} />
			<Panel isActive={isMenuVisible} mod='auth'>
				<form onSubmit={handleSubmit} className='form'>
					<Input type='email' id='email' label='Email' ref={emailRef} />
					<Input
						type='password'
						id='password'
						label='Password'
						ref={passwordRef}
					/>
					{formView === FormViews.LOGIN ? (
						<p style={{ textAlign: 'right' }}>
							Need an account?{' '}
							<u role='button' onClick={toggleFormView}>
								Sign Up
							</u>
						</p>
					) : (
						<>
							<Input
								type='password'
								id='passwordConfirmation'
								label='Password Confirmation'
								ref={passwordConfirmationRef}
								required
							/>
							<p style={{ textAlign: 'right' }}>
								Already have an account?{' '}
								<u role='button' onClick={toggleFormView}>
									Log In
								</u>
							</p>
						</>
					)}
					<Button mod='wide' type='submit' disabled={loading}>
						{submitButtonText}
					</Button>
					{error && (
						<p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
					)}
				</form>
			</Panel>
		</>
	);
};
