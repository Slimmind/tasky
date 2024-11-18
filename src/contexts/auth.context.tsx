import {
	createContext,
	useContext,
	useState,
	useEffect,
	PropsWithChildren,
} from 'react';
import {
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
	User,
	UserCredential,
	getAuth,
	onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

type AuthContextType = {
	currentUser: User | null;
	signup: (
		name: string,
		email: string,
		password: string
	) => Promise<UserCredential>;
	login: (email: string, password: string) => Promise<UserCredential>;
	loginWithGoogle: () => Promise<UserCredential>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const auth = getAuth();
	const db = getFirestore();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, [auth]);

	const signup = async (name: string, email: string, password: string) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			if (user) {
				await updateProfile(user, {
					displayName: name,
				});
				console.log('User profile updated with displayName:', name);
				const uid = user.uid;
				const userDocRef = doc(db, 'users', uid);

				const userDocSnapshot = await getDoc(userDocRef);
				console.log('SNAPSHOT: ', userDocSnapshot);

				if (!userDocSnapshot.exists()) {
					await setDoc(userDocRef, {
						email: user.email,
						displayName: user.displayName,
						createdAt: new Date(),
						tasks: [],
					});
					console.log('Пользователь добавлен в коллекцию users');
				} else {
					console.log('Пользователь уже существует');
				}
			}

			return userCredential;
		} catch (error) {
			console.error('Error during sign up:', error);
			throw error;
		}
	};

	const login = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const loginWithGoogle = async (): Promise<UserCredential> => {
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const uid = user.uid;
			const userDocRef = doc(db, 'users', uid);

			const userDocSnapshot = await getDoc(userDocRef);
			console.log('SNAPSHOT: ', userDocSnapshot);

			if (!userDocSnapshot.exists()) {
				await setDoc(userDocRef, {
					email: user.email,
					displayName: user.displayName,
					createdAt: new Date(),
					tasks: [],
				});
				console.log('Пользователь добавлен в коллекцию users');
			} else {
				console.log('Пользователь уже существует');
			}
			return result;
		} catch (error) {
			console.error('Ошибка входа:', error);
			throw error;
		}
	};

	const logout = async (): Promise<void> => {
		await signOut(auth);
		console.log('LOGOUT');
	};

	const value = {
		currentUser,
		signup,
		login,
		loginWithGoogle,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
