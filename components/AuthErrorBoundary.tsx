"use client";

import React from "react";

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AuthErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Auth error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Authentication Error
            </h2>
            <p className="text-gray-600">
              There was a problem with authentication. Please try logging in
              again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/login";
              }}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
