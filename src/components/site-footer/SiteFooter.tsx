import { Link, useParams, useRouterState } from "@tanstack/react-router";
import "./site-footer.styles.css";
import clsx from "clsx";

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear();
  const location = useRouterState({ select: (state) => state.location });
  const { boardId: paramBoardId } = useParams({ strict: false });
  const searchBoardId = (location.search as { boardId?: string }).boardId;
  const boardId = paramBoardId ?? searchBoardId;

  const isFormOpen =
    location.pathname.includes("/add") || location.pathname.includes("/edit/");

  const classes = clsx(
    "btn btn--icon btn--add",
    isFormOpen ? "btn--active" : "",
  );

  // Когда форма открыта, кнопка работает как «закрыть»; иначе добавляет задание
  // на странице проекта и проект — во всех остальных местах.
  let control;
  if (isFormOpen && boardId) {
    control = (
      <Link
        to="/boards/$boardId"
        params={{ boardId }}
        className={classes}
        aria-label="close form"
      />
    );
  } else if (isFormOpen) {
    control = <Link to="/" className={classes} aria-label="close form" />;
  } else if (boardId) {
    control = (
      <Link
        to="/tasks/add"
        search={{ boardId }}
        className={classes}
        aria-label="add task"
      />
    );
  } else {
    control = (
      <Link to="/boards/add" className={classes} aria-label="add board" />
    );
  }

  return (
    <footer className="site-footer">
      <small className="site-footer__copyright">
        SLIMMIND &copy; {currentYear}
      </small>

      <div className="site-footer__controls">{control}</div>
    </footer>
  );
};
