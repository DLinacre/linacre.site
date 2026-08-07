import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="linacre-surface border border-rose-500/20 bg-[#0B1220]/85 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto my-12 backdrop-blur-xl"
          id="error-boundary-container"
        >
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-[#FB7185] shadow-[0_0_20px_rgba(251,113,133,0.15)] animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-alert-triangle"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold tracking-tight text-rose-200">
              System Fault Isolated
            </h2>
            <p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
              An unexpected exception was intercepted by the sandbox environment controller.
            </p>
          </div>

          {this.state.error && (
            <div className="text-left bg-[#070A0F] border border-amber-color/15 rounded-xl p-4 font-mono text-[11px] text-[#FB7185] max-h-52 overflow-y-auto scrollbar-thin select-text">
              <div className="font-bold border-b border-rose-500/10 pb-2 mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Error Log</span>
                <span className="text-[9px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-[#FB7185]">
                  Fault isolated
                </span>
              </div>
              <div className="font-semibold text-foreground mb-1">
                {this.state.error.name}: {this.state.error.message}
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed opacity-75 overflow-x-auto text-[10px] text-muted-foreground">
                {this.state.error.stack || 'No stack trace available.'}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2 bg-amber-color hover:bg-amber-glow text-[#070A0F] font-mono text-xs font-bold rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:-translate-y-0.5"
            >
              Reboot Environment
            </button>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-5 py-2 bg-transparent border border-border-color hover:border-amber-color/50 text-muted-foreground hover:text-foreground font-mono text-xs font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Home Directory
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
