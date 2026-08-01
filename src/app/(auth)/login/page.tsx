'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login({ email, password });
    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Login failed. Please check credentials.');
    }
    setLoading(false);
  };

  const handleDemoLogin = async (type: 'admin' | 'customer') => {
    setError('');
    setLoading(true);
    const demoCreds =
      type === 'admin'
        ? { email: 'admin@railmart.com', password: 'Admin@123456' }
        : { email: 'customer@railmart.com', password: 'Customer@123456' };

    setEmail(demoCreds.email);
    setPassword(demoCreds.password);

    const res = await login(demoCreds);
    if (res.success) {
      if (type === 'admin') router.push('/admin');
      else router.push('/products');
    } else {
      setError(res.error || 'Demo login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl mx-auto shadow-lg shadow-amber-500/10">
            D
          </div>
          <h1 className="text-2xl font-extrabold text-white">Sign In to Enterprise D Team</h1>
          <p className="text-xs text-slate-400">Official Tatkal Software Portal (denterpriese.softvps.in)</p>
        </div>

        {/* Demo Accounts Bar */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold py-2 rounded-xl transition-all"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="bg-railway-500/10 hover:bg-railway-500/20 text-railway-400 border border-railway-500/30 font-bold py-2 rounded-xl transition-all"
            >
              Demo Customer
            </button>
          </div>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-railway-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
