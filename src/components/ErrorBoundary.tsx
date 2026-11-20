import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unexpected error' };
  }

  componentDidCatch(error: Error) {
    console.error('App boundary caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1A1A1A] border border-[#C9A13B]/30 p-8 text-center">
            <h1 className="font-display text-2xl text-[#E8D08A] mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-[#F5F1E8]/70 mb-6">
              Please refresh the page to continue browsing Omar Cell.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8D08A] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
