import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, loginUser, registerUser, addToast } = useShop();

  const [mode, setMode] = useState('login'); // login | signup | forgot
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await loginUser(email, password);
      } else if (mode === 'signup') {
        await registerUser(name, email, password);
      } else if (mode === 'forgot') {
        addToast('Password reset link sent to your email address.', 'success');
        setMode('login');
      }
    } catch (err) {
      console.warn('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={() => setIsAuthOpen(false)}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '440px',
          width: '100%',
          padding: '2rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Auth Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            {mode === 'login' ? 'Welcome Back to NexCart' : mode === 'signup' ? 'Create Your NexCart Account' : 'Reset Password'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Enter your credentials to access your account & orders' : mode === 'signup' ? 'Fill in your details below to create your account' : 'Enter your registered email'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Full Name</label>
              <div style={{ position: 'relative', marginTop: '0.2rem' }}>
                <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Email Address</label>
              <div style={{ position: 'relative', marginTop: '0.2rem' }}>
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => setMode('forgot')} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Forgot?</button>
                )}
              </div>
              <div style={{ position: 'relative', marginTop: '0.2rem' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '0.92rem',
              marginTop: '0.5rem'
            }}
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <span>Don't have an account? <button onClick={() => setMode('signup')} style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>Sign Up</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setMode('login')} style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>Sign In</button></span>
          )}
        </div>

      </div>
    </div>
  );
}
