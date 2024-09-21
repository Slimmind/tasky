import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { auth } from '../firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	User,
	UserCredential,
} from 'firebase/auth';

// Create a type for the auth context data
type AuthContextType = {
	currentUser: User | null;
	login: (email: string, password: string) => Promise<UserCredential>;
	signup: (email: string, password: string) => Promise<UserCredential>;
	loginWithGoogle: () => Promise<UserCredential>;
	logout: () => Promise<void>;
};

type AuthProviderProps = {
	children: ReactNode;
};

// Create the context
const AuthContext = createContext<AuthContextType>(null!);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const signup = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const login = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const loginWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	};

	const logout = () => {
		return signOut(auth);
	};

	const value = {
		currentUser,
		login,
		signup,
		loginWithGoogle,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

