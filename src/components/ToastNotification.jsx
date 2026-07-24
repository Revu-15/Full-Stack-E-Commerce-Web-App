import React from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification() {
  const { toasts, removeToast } = useShop();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      zIndex: 1300,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      maxWidth: '360px'
    }}>
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className="glass-card"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              background: isSuccess ? 'rgba(16, 185, 129, 0.92)' : isError ? 'rgba(239, 68, 68, 0.92)' : 'var(--bg-surface)',
              color: isSuccess || isError ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
              {isSuccess ? <CheckCircle2 size={18} /> : isError ? <AlertCircle size={18} /> : <Info size={18} color="var(--accent-primary)" />}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} style={{ color: 'inherit', opacity: 0.8 }}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
