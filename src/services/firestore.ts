import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { BoardType, TaskType } from "../utils/constants";

const BOARDS_COLLECTION = "boards";

export const subscribeToBoards = (
  userId: string,
  onUpdate: (boards: BoardType[]) => void,
  onError: (error: Error) => void,
) => {
  const q = query(
    collection(db, BOARDS_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const boards = snapshot.docs
        .map((doc) => doc.data() as BoardType)
        .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
      onUpdate(boards);
    },
    onError,
  );
};

export const createBoard = async (board: BoardType, userId: string) => {
  await setDoc(doc(db, BOARDS_COLLECTION, board.id), { ...board, userId });
};

export const updateBoardInfo = async (
  boardId: string,
  fields: Pick<BoardType, "title" | "description">,
) => {
  await updateDoc(doc(db, BOARDS_COLLECTION, boardId), fields);
};

export const saveTasks = async (boardId: string, tasks: TaskType[]) => {
  await updateDoc(doc(db, BOARDS_COLLECTION, boardId), { tasks });
};

export const deleteBoard = async (boardId: string) => {
  await deleteDoc(doc(db, BOARDS_COLLECTION, boardId));
};
