import { FormEvent, useRef, useState, lazy } from "react";
import { useAuth } from "../../contexts/auth.context";
import { FormViews } from "../../utils/constants";
import "./auth.styles.css";

const Button = lazy(() => import("../button"));
const Panel = lazy(() => import("../panel"));
const Input = lazy(() => import("../input"));

type AuthProps = {
  isActive: boolean;
  togglePanel: () => void;
};

export const Auth = ({ isActive, togglePanel }: AuthProps) => {
  const { login, sign_up } = useAuth();
  const [error, setError] = useState("");
  const [formView, setFormView] = useState(FormViews.LOGIN);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const passwordConfirmationRef = useRef<
    HTMLInputElement | HTMLTextAreaElement
  >(null);

  const toggleFormView = () => {
    setFormView((prev) =>
      prev === FormViews.LOGIN ? FormViews.SIGN_UP : FormViews.LOGIN,
    );
  };

  const submitButtonText =
    formView === FormViews.LOGIN ? "Log In" : "Create An Account";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (emailRef.current?.value && passwordRef.current?.value) {
      if (formView === FormViews.LOGIN) {
        try {
          setError("");
          await login(emailRef.current?.value, passwordRef.current?.value);
        } catch {
          setError("Failed to log in");
        }
      } else {
        if (
          passwordRef.current?.value !== passwordConfirmationRef.current?.value
        ) {
          return setError("Passwords do not match");
        }

        try {
          setError("");
          setLoading(true);
          await sign_up(emailRef.current?.value, passwordRef.current?.value);
          setFormView(FormViews.LOGIN);
        } catch {
          setError("Failed to crete an account");
        }
        setLoading(false);
      }
    }
  }

  return (
    <>
      <Button mod="icon auth" onClick={togglePanel} />
      <Panel isActive={isActive} mod="auth">
        <form onSubmit={handleSubmit} className="form">
          <Input type="email" id="email" label="Email" ref={emailRef} />
          <Input
            type="password"
            id="password"
            label="Password"
            ref={passwordRef}
          />
          {formView === FormViews.LOGIN ? (
            <p style={{ textAlign: "right" }}>
              Need an account?{" "}
              <u role="button" onClick={toggleFormView}>
                Sign Up
              </u>
            </p>
          ) : (
            <>
              <Input
                type="password"
                id="passwordConfirmation"
                label="Password Confirmation"
                ref={passwordConfirmationRef}
                required
              />
              <p style={{ textAlign: "right" }}>
                Already have an account?{" "}
                <u role="button" onClick={toggleFormView}>
                  Log In
                </u>
              </p>
            </>
          )}
          <Button mod="wide" type="submit" disabled={loading}>
            {submitButtonText}
          </Button>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
        </form>
      </Panel>
    </>
  );
};
