import {
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from 'react';
import {
	onSnapshot,
	updateDoc,
	doc,
	getDoc,
	arrayUnion,
	arrayRemove,
} from 'firebase/firestore';
import { TaskType } from '../utils/constants';
import db from '../firebase';
import { useAuth } from './auth.context';

interface FirestoreContextType {
	tasks: TaskType[];
	readTask: (taskId: string) => Promise<TaskType | undefined>;
	addTask: (task: TaskType) => Promise<void>;
	deleteTask: (taskId: string) => Promise<void>;
	changeTask: (taskId: string, updatedTask: Partial<TaskType>) => Promise<void>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(
	undefined
);

export const FirestoreProvider = ({ children }: PropsWithChildren) => {
	const [tasks, setTasks] = useState<TaskType[]>([]);
	const { currentUser } = useAuth();

	useEffect(() => {
		if (!currentUser) {
			console.error('User ID is undefined');
			return;
		}

		const userDocRef = doc(db, 'users', currentUser.uid);
		const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				const userData = docSnapshot.data();
				setTasks(userData.tasks || []);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [currentUser]);

	const readTask = async (taskId: string) => {
		if (!currentUser) {
			throw new Error('User ID is undefined');
		}
		const userDocRef = doc(db, 'users', currentUser.uid);
		const userSnapshot = await getDoc(userDocRef);
		if (userSnapshot.exists()) {
			const userTasks = userSnapshot.data().tasks as TaskType[];
			return userTasks.find((task) => task.id === taskId);
		} else {
			console.log('No such document!');
		}
	};

	const addTask = async (task: TaskType) => {
		if (!currentUser) {
			throw new Error('User ID is undefined');
		}
		const userDocRef = doc(db, 'users', currentUser.uid);
		await updateDoc(userDocRef, {
			tasks: arrayUnion(task),
		});
	};

	const deleteTask = async (taskId: string) => {
		if (!currentUser) {
			throw new Error('User ID is undefined');
		}
		const userDocRef = doc(db, 'users', currentUser.uid);
		const userSnapshot = await getDoc(userDocRef);
		if (userSnapshot.exists()) {
			const userTasks = userSnapshot.data().tasks as TaskType[];
			const taskToRemove = userTasks.find((task) => task.id === taskId);
			if (taskToRemove) {
				await updateDoc(userDocRef, {
					tasks: arrayRemove(taskToRemove),
				});
			}
		}
	};

	const changeTask = async (taskId: string, updatedTask: Partial<TaskType>) => {
		if (!currentUser) {
			throw new Error('User ID is undefined');
		}
		const userDocRef = doc(db, 'users', currentUser.uid);
		const userSnapshot = await getDoc(userDocRef);
		if (userSnapshot.exists()) {
			const userTasks = userSnapshot.data().tasks as TaskType[];
			const taskIndex = userTasks.findIndex((task) => task.id === taskId);
			if (taskIndex !== -1) {
				const updatedTasks = [...userTasks];
				updatedTasks[taskIndex] = {
					...updatedTasks[taskIndex],
					...updatedTask,
				};
				await updateDoc(userDocRef, {
					tasks: updatedTasks,
				});
			}
		}
	};

	return (
		<FirestoreContext.Provider
			value={{
				tasks,
				readTask,
				addTask,
				deleteTask,
				changeTask,
			}}
		>
			{children}
		</FirestoreContext.Provider>
	);
};

export const useFirestore = (): FirestoreContextType => {
	const context = useContext(FirestoreContext);
	if (!context) {
		throw new Error('useFirestore must be used within a FirestoreProvider');
	}
	return context;
};
