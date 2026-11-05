import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../context/auth.context";

// Повторно прогоняет guard из beforeLoad при входе/выходе пользователя.
export const AuthWatcher = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    router.invalidate();
  }, [currentUser, router]);

  return null;
};
