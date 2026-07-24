'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { authApi } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register({ name, email, password });
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Try again.');
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
          <h1 className="text-xl font-bold text-white">Create NexCart Account</h1>
          <p className="text-xs text-gray-400">Join India's premier e-commerce platform</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-green-400 font-bold text-sm">Account Created Successfully!</div>
              <div className="text-xs text-gray-400">Redirecting you to login...</div>
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
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

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
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      minLength={6}
                      className="w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="nex-btn-gradient w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-amber-400 font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
