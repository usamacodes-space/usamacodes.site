import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ChatErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Chat error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-5 rounded-xl bg-[#5d707f]/10 border border-red-500/30 text-[var(--brand-slate-light)] font-mono text-[13px]">
          <p className="text-red-400 mb-2">Chat temporarily unavailable.</p>
          {this.props.onRetry && (
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry?.();
              }}
              className="text-[#f97316] hover:text-[#ea580c] underline"
            >
              Retry
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
