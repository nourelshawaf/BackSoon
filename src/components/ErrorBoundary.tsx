import { Component, type ErrorInfo, type ReactNode } from 'react';
import { clearSavedDemo } from '../store';

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Last line of defence for a live demo: if anything throws while rendering,
 * show a recovery screen instead of a blank page. "Reset demo" also clears the
 * saved demo state, which is the most likely cause of a bad render.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('BackSoon crashed while rendering', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="font-display font-700 text-3xl tracking-tight mb-4">
            <span className="text-accent">B</span>
            <span className="text-warm">ack</span>
            <span className="text-accent">S</span>
            <span className="text-warm">oon</span>
          </p>
          <h1 className="font-display font-700 text-xl text-foreground mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Reload the page. If it happens again, reset the demo to its starting data.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:brightness-110 transition"
            >
              Reload
            </button>
            <button
              onClick={() => {
                clearSavedDemo();
                window.location.reload();
              }}
              className="px-4 py-2.5 border border-border bg-card text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Reset demo and reload
            </button>
          </div>
        </div>
      </main>
    );
  }
}
