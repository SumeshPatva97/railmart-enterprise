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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-railway-500/10 border border-railway-500/20 text-railway-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>RDSO Certified Railway Equipment Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Next-Gen Railway <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-railway-400 via-blue-400 to-indigo-300">
              Spares & Equipment
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Streamlined procurement for railway contractors and workshop engineers. Heavy hydraulic rail benders, 110V LED signals, 25kV pantographs, and 1000V insulated safety tool kits with instant GST tax credit.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="bg-railway-600 hover:bg-railway-500 text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-railway-600/30 flex items-center gap-2 group"
            >
              <span>Explore Products Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/account?tab=tickets"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              Request Bulk Quotation
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 text-slate-400 text-xs">
            <div>
              <div className="text-2xl font-black text-white">10,000+</div>
              <p className="mt-0.5">Track Miles Equipped</p>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <p className="mt-0.5">RDSO Compliant</p>
            </div>
            <div>
              <div className="text-2xl font-black text-white">24-Hr</div>
              <p className="mt-0.5">Fast Dispatch</p>
            </div>
          </div>
        </motion.div>

        {/* Right Glassmorphism Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80"
              alt="Railway Freight & Equipment"
              className="w-full h-80 sm:h-96 object-cover rounded-2xl"
            />
            {/* Floating Glassmorphism Badge */}
            <div className="absolute bottom-8 left-8 right-8 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-railway-500/20 text-railway-400 flex items-center justify-center">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Featured Equipment</h4>
                  <p className="text-[11px] text-slate-400">100-Ton Hydraulic Rail Bender</p>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                In Stock & Certified
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
