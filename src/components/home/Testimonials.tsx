'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, Award, Sparkles, Building2 } from 'lucide-react';

const reviews = [
  {
    name: 'Er. Rajesh Vardhan',
    role: 'Chief Engineer, Northern Track Infra',
    text: 'RailMart delivered 12 units of 100-Ton Hydraulic Rail Benders to our Sonipat site within 36 hours. RDSO certificates were attached with instant GST tax invoices.',
    rating: 5,
    org: 'Northern Railway Contractor',
    avatarGradient: 'from-amber-500 to-yellow-600',
    initials: 'RV',
  },
  {
    name: 'Sanjeev Mukherjee',
    role: 'Procurement Head, Eastern Loco Works',
    text: 'Finding certified 25kV WAP-7 pantograph assemblies used to take weeks. RailMart provided OEM quality pantographs with transparent pricing and full warranty support.',
    rating: 5,
    org: 'Eastern Electrification Infra',
    avatarGradient: 'from-sky-500 to-blue-600',
    initials: 'SM',
  },
  {
    name: 'Kavita Sundaram',
    role: 'Safety Audit Director',
    text: 'The 1000V VDE insulated tool kits meet all international safety standards. Very impressed by their responsive support ticket desk and CRM team.',
    rating: 5,
    org: 'Trackside Safety India',
    avatarGradient: 'from-emerald-500 to-teal-600',
    initials: 'KS',
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 bg-slate-950 border-b border-slate-900 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-railway-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Industry Endorsements</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">Railway Engineers</span>
          </h2>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-7 sm:p-8 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Card Accent Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Decorative Top Line Glow */}
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card Content Top */}
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>

                  {/* Glowing Quote Icon */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-all">
                    <Quote className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>

                {/* Review Quote Text */}
                <p className="text-sm sm:text-base text-slate-300 italic leading-relaxed font-normal">
                  {`"${rev.text}"`}
                </p>
              </div>

              {/* Reviewer Details Bottom */}
              <div className="relative z-10 mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Circular Avatar */}
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${rev.avatarGradient} flex items-center justify-center text-slate-950 font-black text-xs shadow-md shrink-0 border border-white/20 group-hover:scale-105 transition-transform`}
                  >
                    {rev.initials}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5 truncate group-hover:text-amber-300 transition-colors">
                      <span className="truncate">{rev.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 fill-sky-400/20" />
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{rev.role}</p>
                  </div>
                </div>
              </div>

              {/* Organization Badge in Footer */}
              <div className="relative z-10 mt-3 pt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400/90 bg-emerald-950/30 border border-emerald-800/30 px-3 py-1.5 rounded-xl w-fit">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{rev.org}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
