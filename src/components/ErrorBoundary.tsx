import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';
import { Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-error-500 text-white">
                <span className="text-2xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
              <p className="text-neutral-600">
                We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
              leftIcon={<Home size={16} />}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;