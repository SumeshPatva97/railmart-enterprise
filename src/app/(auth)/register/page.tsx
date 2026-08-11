'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Train, User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
        router.replace('/admin');
      } else {
        router.replace('/account');
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setError('Mobile phone number must be exactly 10 digits (e.g. 9876543210).');
      return;
    }

    setLoading(true);

    const res = await register({ name, email, phone: cleanedPhone, password });
    if (res.success) {
      const registeredUser = res.user;
      if (registeredUser?.role === 'ADMIN' || registeredUser?.role === 'SUPPORT') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setError(res.error || 'Registration failed.');
    }
    setLoading(false);
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-railway-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-railway-600/30">
            <Train className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-xs text-slate-400">Join D ENTERPRISE TEAM to order Tatkal booking tools & extensions.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-4 rounded-xl font-semibold space-y-2">
            <p>{error}</p>
            {error.includes('already exists') && (
              <div className="pt-2 border-t border-rose-500/20 flex flex-wrap gap-3 text-xs">
                <Link
                  href={`/login?email=${encodeURIComponent(email)}`}
                  className="bg-railway-600 hover:bg-railway-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center gap-1 transition-all"
                >
                  Sign In to Your Account →
                </Link>
                <Link
                  href={`/forgot-password?email=${encodeURIComponent(email)}`}
                  className="text-amber-400 hover:underline py-1 text-[11px] font-bold"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>
        )}

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
            <label className="text-slate-300 block mb-1 font-bold flex items-center justify-between">
              <span>Mobile Phone Number</span>
              <span className="text-[10px] text-amber-400 font-normal">Must be 10 digits</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number (e.g. 9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
