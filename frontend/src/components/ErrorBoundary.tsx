import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { theme, cardStyle, buttonPrimary } from '../theme';

interface Props {
  children: ReactNode;
  moduleName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary - ${this.props.moduleName || 'App'}]`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ ...cardStyle, padding: 28, textAlign: 'center', margin: '20px auto', maxWidth: 640 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <AlertTriangle size={24} color={theme.red} />
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: theme.text }}>
            Operational View Exception ({this.props.moduleName || 'Workspace'})
          </h3>

          <p style={{ margin: '0 0 16px', fontSize: 13, color: theme.textMuted }}>
            The application intercepted a runtime display error in this workspace. Surrounding control room monitoring remains active.
          </p>

          {this.state.error && (
            <div style={{
              background: '#f1f5f9',
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              padding: '10px 14px',
              fontSize: 12,
              color: '#475569',
              fontFamily: 'monospace',
              textAlign: 'left',
              marginBottom: 18,
              overflowX: 'auto'
            }}>
              {this.state.error.message || 'Unknown render exception'}
            </div>
          )}

          <button
            onClick={this.handleReset}
            style={{ ...buttonPrimary, margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} />
            Retry Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
