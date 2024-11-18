import { useState, lazy, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../../contexts/auth.context';
import './auth.styles.css';

const Button = lazy(() => import('../button'));
const Input = lazy(() => import('../input'));
const Panel = lazy(() => import('../panel'));

type AuthProps = {
	isActive: boolean;
	togglePanel: () => void;
};

type Credentials = {
	email: string;
	password: string;
	name: string;
	passwordConfirmation?: string;
};

export const Auth = ({ isActive, togglePanel }: AuthProps) => {
	const { login, signup, logout, currentUser } = useAuth();
	const [hasAccount, setHasAccount] = useState<boolean>(false);
	const initialCredentials = {
		email: '',
		password: '',
		name: currentUser?.displayName || '',
		passwordConfirmation: '',
	};
	const [credentials, setCredentials] =
		useState<Credentials>(initialCredentials);
	const [loading, setLoading] = useState<boolean>(false);

	const handleChangeInput = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setCredentials((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setLoading(true);

		if (!hasAccount) {
			if (credentials.password === credentials.passwordConfirmation) {
				try {
					await signup(
						credentials.name,
						credentials.email,
						credentials.password
					);
					setCredentials(initialCredentials);
					console.log('CREDS: ', credentials);
				} catch (err) {
					console.log('Failed to crete an account', err);
				} finally {
					setLoading(false);
				}
			}
		} else {
			try {
				await login(credentials.email, credentials.password);
				setCredentials(initialCredentials);
				console.log('CREDS: ', credentials);
			} catch (err) {
				console.log('Error', err);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<section className='auth'>
			<Button
				mod='icon bordered auth'
				onClick={togglePanel}
				aria-label='open authentication menu'
			/>
			<Panel
				isActive={isActive}
				mod='auth'
				filled={true}
				title='Аутентификация'
			>
				{currentUser?.uid ? (
					<Button mod='wide secondary' onClick={logout} aria-label='log out'>
						Log Out
					</Button>
				) : (
					<>
						<form onSubmit={handleSubmit}>
							{!hasAccount && (
								<Input
									id='name'
									name='name'
									type='name'
									label='Name'
									onChange={handleChangeInput}
									required
								/>
							)}
							<Input
								id='email'
								name='email'
								type='email'
								label='Email'
								onChange={handleChangeInput}
								required
								autoComplete='off'
							/>
							<Input
								id='password'
								name='password'
								type='password'
								label='Password'
								onChange={handleChangeInput}
								required
								minLength={6}
								autoComplete='off'
							/>
							{!hasAccount && (
								<Input
									id='passwordConfirmation'
									name='passwordConfirmation'
									type='password'
									label='Confirm Password'
									onChange={handleChangeInput}
									required
									minLength={6}
								/>
							)}
							{hasAccount ? (
								<p className='auth__notification'>
									<u onClick={() => setHasAccount(false)} role='button'>
										Create an account
									</u>
								</p>
							) : (
								<p className='auth__notification'>
									Already have an account?{' '}
									<u onClick={() => setHasAccount(true)} role='button'>
										Log In
									</u>
								</p>
							)}

							<Button
								mod='wide'
								type='submit'
								actionClass={loading ? 'loading' : ''}
							>
								Submit
							</Button>
						</form>
					</>
				)}
			</Panel>
		</section>
	);
};
