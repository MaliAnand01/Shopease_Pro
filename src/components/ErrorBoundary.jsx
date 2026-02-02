import React from "react";
import ErrorScreen from "./ErrorScreen";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.group("🔴 ErrorBoundary Caught Exception");
    console.error("Error:", error);
    console.error("Component Stack:", info.componentStack);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen 
          message="We encountered an unexpected technical issue." 
          error={this.state.error}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
