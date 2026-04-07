'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-[#1e1f20] border border-[#3c4043] rounded-xl">
          <p className="text-red-400 text-sm font-bold mb-2">Something went wrong</p>
          <p className="text-gray-500 text-xs mb-4">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-500"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
