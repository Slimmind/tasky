import { useEffect, useRef } from "react";
import { useAuth } from "../context/auth.context";
import { useBoardsStore } from "../store/boards.store";
import { subscribeToBoards } from "../services/firestore";
import { getRandomRGB } from "../utils/get-random-rgb";

export const StoreInitializer = () => {
  const { currentUser } = useAuth();
  const setBoards = useBoardsStore((state) => state.setBoards);
  const setIsLoading = useBoardsStore((state) => state.setIsLoading);
  const setError = useBoardsStore((state) => state.setError);
  const addBoard = useBoardsStore((state) => state.addBoard);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    setError(null);
    if (!currentUser) {
      setBoards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToBoards(
      currentUser.uid,
      (boards) => {
        if (isFirstLoad.current && boards.length === 0) {
          addBoard(
            {
              title: "Первый проект",
              description:
                "Заголовок и описание проекта можно будет отредактировать позже",
              color: getRandomRGB(),
              tasks: [],
            },
            currentUser.uid,
          ).catch((error) => {
            console.error("Failed to create the first board:", error);
            setError("Не удалось создать первый проект");
            setIsLoading(false);
          });
        } else {
          setBoards(boards);
          setIsLoading(false);
        }
        isFirstLoad.current = false;
      },
      (error) => {
        console.error("Boards subscription failed:", error);
        setError("Не удалось загрузить проекты");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser, setBoards, setIsLoading, setError, addBoard]);

  return null;
};
