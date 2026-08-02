import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[StellarPass] Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 py-12">
          <div className="w-full max-w-md animate-scale-in">
            <div className="card-altius">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded bg-[var(--color-error-subtle)]">
                <svg className="h-7 w-7 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text)]">Something went wrong</h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                An unexpected error occurred in the StellarPass application. Please try reloading the page.
              </p>
              {this.state.error && (
                <div className="mt-4 overflow-x-auto rounded bg-[var(--color-bg-tertiary)] p-4 text-xs font-mono text-[var(--color-error)] border border-[var(--color-border)]">
                  {this.state.error.toString()}
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="btn-primary mt-6 w-full"
              >
                Reload application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
