import "./welcome.styles.css";

export const Welcome = () => {
  return (
    <div className="welcome">
      <h3 className="welcome__title">
        Hi! Looks like you're not signed in yet :)
      </h3>
      <p>Please log in to see your tasks...</p>
    </div>
  );
};
