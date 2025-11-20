import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { BoardType } from "../utils/constants";

const BOARDS_COLLECTION = "boards";

export const subscribeToBoards = (
  userId: string,
  onUpdate: (boards: BoardType[]) => void,
) => {
  const q = query(
    collection(db, BOARDS_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(q, (snapshot) => {
    const boards = snapshot.docs.map((doc) => doc.data() as BoardType);
    onUpdate(boards);
  });
};

export const saveBoard = async (board: BoardType, userId: string) => {
  const boardRef = doc(db, BOARDS_COLLECTION, board.id);
  await setDoc(boardRef, { ...board, userId }, { merge: true });
};

export const deleteBoard = async (boardId: string) => {
  await deleteDoc(doc(db, BOARDS_COLLECTION, boardId));
};
