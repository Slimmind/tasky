import { describe, it, expect } from "vitest";
import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage } from "./get-auth-error-message";

describe("getAuthErrorMessage", () => {
  it("translates known Firebase codes", () => {
    const error = new FirebaseError("auth/invalid-credential", "raw message");
    expect(getAuthErrorMessage(error)).toBe(
      "Неверный адрес электронной почты или пароль",
    );
  });

  it("falls back for unknown Firebase codes without leaking the raw message", () => {
    const error = new FirebaseError("auth/something-new", "raw message");
    expect(getAuthErrorMessage(error)).toBe("Не удалось выполнить вход");
  });

  it("keeps messages of regular errors", () => {
    expect(getAuthErrorMessage(new Error("Пароли не совпадают"))).toBe(
      "Пароли не совпадают",
    );
  });

  it("handles non-error values", () => {
    expect(getAuthErrorMessage("boom")).toBe("Произошла неизвестная ошибка");
  });
});
