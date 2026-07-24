import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NexCart App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>NexCart E-Commerce Platform</h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Application interface refreshed. Click below to load your store session.
          </p>

          {this.state.error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', maxWidth: '600px', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
              {String(this.state.error?.message || this.state.error)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                window.location.reload();
              }}
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              Reload Store Session
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{ background: '#334155', color: '#f8fafc', border: '1px solid #475569', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              Reset Storage & Launch Clean Store
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

