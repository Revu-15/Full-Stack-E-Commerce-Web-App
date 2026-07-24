'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { authApi } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
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
          <h1 className="text-xl font-bold text-white">Welcome Back</h1>
          <p className="text-xs text-gray-400">Sign in to your NexCart account</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-amber-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="nex-btn-gradient w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-amber-400 font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
