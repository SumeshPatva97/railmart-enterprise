'use client';

import React from 'react';
import Link from 'next/link';
import { Train, ShieldCheck, Truck, Headphones, FileText, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-900">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-railway-500/10 text-railway-400 border border-railway-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">RDSO Compliant</h4>
            <p className="text-xs text-slate-400 mt-1">Certified quality for Indian Railways contractor standards.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-railway-500/10 text-railway-400 border border-railway-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Pan-India Freight</h4>
            <p className="text-xs text-slate-400 mt-1">Direct workshop dispatch with insured heavy logistics.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-railway-500/10 text-railway-400 border border-railway-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">GST Tax Invoice</h4>
            <p className="text-xs text-slate-400 mt-1">Instant 18% GST input credit invoice download for corporate orders.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-railway-500/10 text-railway-400 border border-railway-500/20">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">24/7 Rail Engineer Support</h4>
            <p className="text-xs text-slate-400 mt-1">Dedicated ticket desk & technical consultation.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <div className="w-9 h-9 rounded-xl bg-railway-600 flex items-center justify-center text-white">
              <Train className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-white">Rail<span className="text-railway-400">Mart</span> Enterprise</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            India's premier digital marketplace for railway track benders, signaling systems, locomotive electrical pantographs, insulated tools, and heavy infrastructure spares.
          </p>
          <div className="pt-2">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter email for procurement updates..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-railway-500"
              />
              <button type="submit" className="bg-railway-600 hover:bg-railway-500 text-white p-2 rounded-lg text-xs font-semibold flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/products?category=track-maintenance-equipment" className="hover:text-white transition-colors">Track Maintenance Tools</Link></li>
            <li><Link href="/products?category=signaling-and-interlocking" className="hover:text-white transition-colors">Signaling & Aspect Lamps</Link></li>
            <li><Link href="/products?category=locomotive-electrical-spares" className="hover:text-white transition-colors">Locomotive Pantographs</Link></li>
            <li><Link href="/products?category=safety-and-trackside-tools" className="hover:text-white transition-colors">1000V Insulated Safety Gear</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/products" className="hover:text-white transition-colors">Browse All Catalog</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">View Cart & GST Calc</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">Customer Account Portal</Link></li>
            <li><Link href="/account?tab=tickets" className="hover:text-white transition-colors">Raise Support Ticket</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Corporate Office</h4>
          <address className="not-italic text-xs leading-relaxed space-y-2 text-slate-400">
            <p>RailMart Equipment Pvt Ltd</p>
            <p>Plot 42, Railway Industrial Zone, Station Road</p>
            <p>New Delhi, 110001, India</p>
            <p className="text-railway-400 font-semibold">Toll Free: 1800-419-RAIL</p>
            <p>Email: sales@railmart-enterprise.com</p>
          </address>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} RailMart Enterprise. Original Railway Commerce Platform.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-400">Terms of Supply</Link>
          <Link href="#" className="hover:text-slate-400">RDSO Quality Policy</Link>
        </div>
      </div>
    </footer>
  );
}
