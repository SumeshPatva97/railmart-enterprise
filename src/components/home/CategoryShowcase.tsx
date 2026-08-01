'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Radio, Zap, Shield } from 'lucide-react';

const categories = [
  {
    title: 'Tatkal Booking Software',
    slug: 'tatkal-booking-software',
    desc: 'High-speed automated IRCTC Tatkal ticket booking software & desktop automation tools.',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    count: '11 Softwares',
  },
  {
    title: 'Tatkal Browser Extensions',
    slug: 'tatkal-browser-extensions',
    desc: 'Lightweight browser-based Tatkal booking extension with simple setup & instant response.',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    count: '1 Extension',
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-slate-900/50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Enterprise D Team Categories</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">High-Speed Tatkal Solutions</h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-semibold text-railway-400 hover:text-railway-300 flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-railway-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-railway-500/10 flex flex-col justify-between"
              >
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-slate-300 px-2.5 py-1 rounded-full">
                    {cat.count}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-railway-500/10 text-railway-400 flex items-center justify-center mb-3 group-hover:bg-railway-500 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-railway-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-railway-400 group-hover:text-railway-300">
                    <span>Browse Equipment</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
