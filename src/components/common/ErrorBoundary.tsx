import React, { Component, ErrorInfo, ReactNode } from 'react';
import { clearAppState, clearAllBlobs } from '../../lib/storage';

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
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleClearAndRestart = async () => {
    try {
      await clearAppState();
      await clearAllBlobs();
      // Force reload to setup page
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to clear local data:', err);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--color-canvas)',
          fontFamily: 'var(--font-sans)',
          padding: 'var(--spacing-md)',
          boxSizing: 'border-box',
        }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            padding: 'var(--spacing-lg)',
            border: '1px solid var(--color-hairline-strong)',
          }}>
            <div style={{
              color: 'var(--color-semantic-error)',
              fontSize: '36px',
              marginBottom: 'var(--spacing-sm)'
            }}>
              ⚠️
            </div>
            <h1 className="title-lg" style={{
              color: 'var(--color-ink)',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 600
            }}>
              Something went wrong
            </h1>
            <p className="body-sm" style={{
              color: 'var(--color-body)',
              marginBottom: 'var(--spacing-lg)',
              lineHeight: '1.5'
            }}>
              An unexpected error occurred. This could be due to invalid or corrupted cache state.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                backgroundColor: 'var(--color-canvas-soft)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--rounded-md)',
                overflowX: 'auto',
                border: '1px solid var(--color-hairline-soft)',
                color: 'var(--color-semantic-error)',
                fontSize: '13px',
                marginBottom: 'var(--spacing-lg)',
                maxHeight: '150px',
              }}>
                <code>{this.state.error.toString()}</code>
              </pre>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <button
                className="button-primary"
                onClick={this.handleClearAndRestart}
                style={{ width: '100%' }}
              >
                Clear Local Data & Restart
              </button>
              <button
                className="button-secondary"
                onClick={() => window.location.reload()}
                style={{ width: '100%' }}
              >
                Try Reloading Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
