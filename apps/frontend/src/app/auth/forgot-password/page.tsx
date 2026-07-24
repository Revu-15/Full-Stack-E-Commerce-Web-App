'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { authApi } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-black font-black text-2xl">
              N
            </div>
            <span className="text-3xl font-black text-white">
              Nex<span className="text-amber-400">Cart</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
          <p className="text-xs text-gray-400">We'll send an email with password reset instructions</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          {sent ? (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-green-400 font-bold text-sm">Reset Link Sent!</div>
              <p className="text-xs text-gray-400">
                Check <strong className="text-white">{email}</strong> for instructions to reset your password.
              </p>
              <Link href="/auth/login" className="inline-block pt-2 text-xs font-bold text-amber-400 hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="nex-btn-gradient w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
                <Link href="/auth/login" className="text-gray-400 hover:text-white flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
