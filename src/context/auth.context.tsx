import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export interface AuthContextType {
  currentUser: User | null;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // updateProfile меняет объект User на месте, поэтому ссылка на него остаётся
  // прежней. Счётчик заставляет потребителей контекста перерисоваться.
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      signUp: async (email, password, displayName) => {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(user, { displayName });
        setProfileVersion((version) => version + 1);
      },
      logIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      logOut: async () => {
        await auth.signOut();
      },
    }),
    // profileVersion нужен только для пересоздания значения после updateProfile
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, profileVersion],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
