import { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorMessage } from "../error-message";
import { Button } from "../button/Button";

export const RouteError = ({ error, reset }: ErrorComponentProps) => {
  console.error("Route error:", error);
  return (
    <>
      <ErrorMessage message="Что-то пошло не так" />
      <Button mod="wide" onClick={reset}>
        Попробовать снова
      </Button>
    </>
  );
};
