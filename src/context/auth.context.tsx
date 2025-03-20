import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

// Тип для контекста
interface AuthContextType {
  currentUser: User | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserName: (displayName: string) => Promise<void>;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Кастомный хук для использования контекста
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Тип для пропсов AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Функция для регистрации пользователя
  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    setCurrentUser(userCredential.user);
  };

  // Функция для входа пользователя
  const logIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
  };

  // Функция для выхода пользователя
  const logOut = async () => {
    await auth.signOut();
    setCurrentUser(null);
  };

  // Функция для обновления имени пользователя
  const updateUserName = async (displayName: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
      setCurrentUser({ ...auth.currentUser, displayName } as User);
    }
  };

  // Подписываемся на изменения состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Отписка при размонтировании
  }, []);

  // Значение, которое будет передаваться через контекст
  const value: AuthContextType = {
    currentUser,
    signUp,
    logIn,
    logOut,
    updateUserName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}