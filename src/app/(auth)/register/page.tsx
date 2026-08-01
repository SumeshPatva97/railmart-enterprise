'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Train, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register({ name, email, phone, password });
    if (res.success) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      setError(res.error || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-railway-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-railway-600/30">
            <Train className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-xs text-slate-400">Join ENTERPRISE D TEAM to order Tatkal booking tools & extensions.</p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-bold font-sans">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

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
            <label className="text-slate-300 block mb-1 font-bold">Mobile Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Enter mobile phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500"
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
            className="w-full bg-railway-600 hover:bg-railway-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-xl shadow-railway-600/30 flex items-center justify-center gap-2"
          >
            {loading ? 'Registering...' : 'Create Account & Send OTP'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-railway-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
