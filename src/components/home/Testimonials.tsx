'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const reviews = [
  {
    name: 'Er. Rajesh Vardhan',
    role: 'Chief Engineer, Northern Track Infra',
    text: 'RailMart delivered 12 units of 100-Ton Hydraulic Rail Benders to our Sonipat site within 36 hours. RDSO certificates were attached with instant GST tax invoices.',
    rating: 5,
    org: 'Northern Railway Contractor',
  },
  {
    name: 'Sanjeev Mukherjee',
    role: 'Procurement Head, Eastern Loco Works',
    text: 'Finding certified 25kV WAP-7 pantograph assemblies used to take weeks. RailMart provided OEM quality pantographs with transparent pricing and full warranty support.',
    rating: 5,
    org: 'Eastern Electrification Infra',
  },
  {
    name: 'Kavita Sundaram',
    role: 'Safety Audit Director',
    text: 'The 1000V VDE insulated tool kits meet all international safety standards. Very impressed by their responsive support ticket desk and CRM team.',
    rating: 5,
    org: 'Trackside Safety India',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold text-railway-400 uppercase tracking-widest">Industry Endorsements</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Trusted by Railway Engineers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-800" />
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">{`"${rev.text}"`}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-railway-400" />
                  </h4>
                  <p className="text-[11px] text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
