"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Send to error reporting service like Sentry, LogRocket, etc.
      // reportError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Something went wrong
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We apologize for the inconvenience. The page encountered an
              unexpected error.
            </p>
            <div className="space-y-3">
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-lg bg-blue-50 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                Reload page
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error details (development only)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs text-red-600 dark:bg-gray-800 dark:text-red-400">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
