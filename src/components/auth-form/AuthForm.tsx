import { lazy, FormEvent, useState } from 'react';
import { useAuth } from '../../context/auth.context';
const Panel = lazy(() => import('../panel'));
const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));
import './auth-form.styles.css';

type AuthFormProps = {
	isActive: boolean;
	togglePanel: () => void;
};

export const AuthForm = ({ isActive, togglePanel }: AuthFormProps) => {
	const { currentUser, signUp, logIn, logOut } = useAuth();
	const [registrationMode, setRegistrationMode] = useState<boolean>(true);

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
			togglePanel();
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<Panel
			mod='auth'
			filled={false}
			isActive={isActive}
			title={
				currentUser
					? 'Вы уже авторизованы'
					: registrationMode
					? 'Регистрация'
					: 'Вход'
			}
		>
			{currentUser ? (
				<Button mod='wide' onClick={() => logOut()}>
					Выйти
				</Button>
			) : (
				<form onSubmit={handleSubmit} autoComplete='off'>
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
						<p className='auth__notification'>
							Если уже зарегистрированы, то{' '}
							<u onClick={() => setRegistrationMode(false)}>
								войдите в систему
							</u>
						</p>
					) : (
						<p className='auth__notification'>
							Если не зарегистрированы, то{' '}
							<u onClick={() => setRegistrationMode(true)}>зарегистрируйтесь</u>
						</p>
					)}
					<Button mod='wide' type='submit'>
						{registrationMode ? 'Зарегистрироваться' : 'Войти'}
					</Button>
				</form>
			)}
		</Panel>
	);
};
