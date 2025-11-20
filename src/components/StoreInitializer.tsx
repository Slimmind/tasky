import { useEffect, useRef } from "react";
import { useAuth } from "../context/auth.context";
import { useBoardsStore } from "../store/boards.store";
import { subscribeToBoards } from "../services/firestore";
import { nanoid } from "nanoid";
import { getRandomRGB } from "../utils/get-random-rgb";

export const StoreInitializer = () => {
  const { currentUser } = useAuth();
  const setBoards = useBoardsStore((state) => state.setBoards);
  const setIsLoading = useBoardsStore((state) => state.setIsLoading);
  const addBoard = useBoardsStore((state) => state.addBoard);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    if (!currentUser) {
      setBoards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToBoards(currentUser.uid, (boards) => {
      if (isFirstLoad.current && boards.length === 0) {
        const firstBoard = {
          id: nanoid(),
          name: "first-board",
          title: "Первый проект",
          description:
            "Заголовок и описание проекта можно будет отредактировать позже",
          color: getRandomRGB(),
          tasks: [],
        };
        addBoard(firstBoard, currentUser.uid);
      } else {
        setBoards(boards);
        setIsLoading(false);
      }
      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, [currentUser, setBoards, setIsLoading, addBoard]);

  return null;
};
