import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorMessage } from "../error-message";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage message="Что-то пошло не так. Попробуйте обновить страницу." />
      );
    }
    return this.props.children;
  }
}
