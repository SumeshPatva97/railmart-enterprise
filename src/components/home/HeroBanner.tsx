'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Award, Train } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 border-b border-slate-900">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-railway-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Tatkal Software Portal (denterpriese.softvps.in)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-200">
              D ENTERPRISE TEAM
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            12 High-Speed IRCTC Tatkal Software & Browser Extensions including GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, PANDA, WINDOW TS, AVATAR, OCEAN EXTENSION, BINGO & RANGER.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 group"
            >
              <span>Explore 12 Tatkal Softwares</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://whatsapp.com/channel/0029Vb8ikne7Noa8Auu2yp0T"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2"
            >
              Join WhatsApp Channel
            </a>
          </div>

          {/* Message from Super Master Bhimdada */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-amber-400 text-sm flex items-center justify-between">
              <span>📢 MESSAGE FROM SUPER MASTER BHIMDADA :-</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">7:30 AM - 12:00 AM Online Support</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Software, VPS, IP, IRCTC ID aur anya related services available hain. Fast support ke liye contact team: <strong className="text-white">+66805849689</strong>
            </p>
          </div>
        </motion.div>

        {/* Right Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">denterpriese.softvps.in</span>
              </div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                12 Products Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">1) GADAR</span>
                <span className="text-sm font-black text-amber-400">₹1,199/-</span>
                <span className="text-[10px] text-emerald-400 block">Multi PNR Support</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">2) STAR_TS</span>
                <span className="text-sm font-black text-amber-400">₹1,149/-</span>
                <span className="text-[10px] text-emerald-400 block">Smart Automation</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">3) PRO MAX</span>
                <span className="text-sm font-black text-amber-400">₹1,499/-</span>
                <span className="text-[10px] text-emerald-400 block">High-Speed Engine</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">4) HITMAN</span>
                <span className="text-sm font-black text-amber-400">₹1,399/-</span>
                <span className="text-[10px] text-emerald-400 block">Smart Assistant</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">5) SUPERMAN</span>
                <span className="text-sm font-black text-amber-400">₹1,599/-</span>
                <span className="text-[10px] text-emerald-400 block">Workflow Master</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">6) BTS (Black Turbo)</span>
                <span className="text-sm font-black text-amber-400">₹1,599/-</span>
                <span className="text-[10px] text-rose-400 block">10% Wallet Cashback</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
