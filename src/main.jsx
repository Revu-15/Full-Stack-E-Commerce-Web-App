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
          <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Application interface refreshed. Click below to load your store session.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('nexcart_admin_token');
              window.location.href = '/';
            }}
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Reload NexCart Store
          </button>
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

