import { Link } from "@tanstack/react-router";
import { ErrorMessage } from "../error-message";

type NotFoundProps = {
  message?: string;
};

export const NotFound = ({
  message = "Страница не найдена",
}: NotFoundProps) => (
  <>
    <ErrorMessage message={message} />
    <Link to="/" className="btn btn--wide">
      На главную
    </Link>
  </>
);
