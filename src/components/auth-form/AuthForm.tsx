import { lazy, FormEvent, useState } from 'react';
import { useAuth } from '../../context/auth.context';
import { ErrorMessage } from '../error-message';
import { useNavigate } from '@tanstack/react-router';
const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));
import './auth-form.styles.css';

export const AuthForm = () => {
	const { currentUser, signUp, logIn, logOut } = useAuth();
	const navigate = useNavigate();
	const [registrationMode, setRegistrationMode] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const displayName = formData.get('displayName') as string;

		try {
			if (registrationMode) {
				if (password !== confirmPassword) {
					throw new Error('Пароли не совпадают');
				}
				await signUp(email, password, displayName);
			} else {
				await logIn(email, password);
			}
			setErrorMessage(null); // Clear error on successful login/signup
			// Redirect to home page after successful authentication
			navigate({ to: '/' });
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('Произошла неизвестная ошибка');
			}
			console.error('Error:', error);
		}
	};

	return (
		<div className='auth-form'>
			{currentUser ? (
				<Button mod='wide' onClick={() => logOut()}>
					Выйти
				</Button>
			) : (
				<form onSubmit={handleSubmit} autoComplete='off'>
					{errorMessage && <ErrorMessage message={errorMessage} />}
					{registrationMode && (
						<Input
							id='displayName'
							name='displayName'
							type='text'
							placeholder='Имя пользователя'
							required
						/>
					)}
					<Input
						id='email'
						name='email'
						type='email'
						placeholder='Адрес электронной почты'
						required
					/>
					<Input
						id='password'
						name='password'
						type='password'
						placeholder='Пароль'
						required
					/>
					{registrationMode && (
						<Input
							id='confirmPassword'
							name='confirmPassword'
							type='password'
							placeholder='Подтвердите пароль'
							required
						/>
					)}
					{registrationMode ? (
						<p className='auth-form__notification'>
							Если уже зарегистрированы, то{' '}
							<u onClick={() => setRegistrationMode(false)}>
								войдите в систему
							</u>
						</p>
					) : (
						<p className='auth-form__notification'>
							Если не зарегистрированы, то{' '}
							<u onClick={() => setRegistrationMode(true)}>зарегистрируйтесь</u>
						</p>
					)}
					<Button mod='wide' type='submit'>
						{registrationMode ? 'Зарегистрироваться' : 'Войти'}
					</Button>
				</form>
			)}
		</div>
	);
};
