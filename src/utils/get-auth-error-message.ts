import { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Неверный адрес электронной почты или пароль",
  "auth/user-not-found": "Неверный адрес электронной почты или пароль",
  "auth/wrong-password": "Неверный адрес электронной почты или пароль",
  "auth/invalid-email": "Некорректный адрес электронной почты",
  "auth/email-already-in-use":
    "Этот адрес электронной почты уже зарегистрирован",
  "auth/weak-password": "Слишком простой пароль (минимум 6 символов)",
  "auth/too-many-requests": "Слишком много попыток. Попробуйте позже",
  "auth/network-request-failed": "Нет соединения с сетью",
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? "Не удалось выполнить вход";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Произошла неизвестная ошибка";
};
