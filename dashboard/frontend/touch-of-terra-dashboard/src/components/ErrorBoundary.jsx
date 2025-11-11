/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 * Prevents entire app from crashing when a component fails
 */

import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // You could also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = false } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback(this.state.error, this.handleReset)
          : fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Something went wrong
            </h3>

            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              This component encountered an error. Please try refreshing or contact support if the problem persists.
            </p>

            {showDetails && this.state.error && (
              <details className="text-left mb-4 p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-700">
                <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                aria-label="Try again"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
