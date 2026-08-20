'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, CheckCircle2, Headphones, Sparkles, Train } from 'lucide-react';

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
}: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // EaseOutExpo easing
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = from + (to - from) * easeOut;
      
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(to);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, from, to, duration]);

  const formattedNumber = count.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="font-extrabold tracking-tight tabular-nums">
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}

export function AnimatedStats() {
  const stats = [
    {
      icon: <Train className="w-6 h-6 text-amber-400" />,
      value: 12,
      suffix: ' Softwares',
      label: 'High-Speed Tatkal Booking Softwares & Extensions',
      decimals: 0,
      gradient: 'from-amber-500/20 to-yellow-500/5',
      border: 'border-amber-500/30',
      textGrad: 'from-amber-400 to-yellow-200',
    },
    {
      icon: <Users className="w-6 h-6 text-sky-400" />,
      value: 10000,
      prefix: '',
      suffix: '+',
      label: 'Active Bookings & Verified Client Successes',
      decimals: 0,
      gradient: 'from-sky-500/20 to-blue-500/5',
      border: 'border-sky-500/30',
      textGrad: 'from-sky-400 to-cyan-200',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      value: 99.8,
      suffix: '%',
      label: 'High-Speed Tatkal Success & Checkout Rate',
      decimals: 1,
      gradient: 'from-emerald-500/20 to-teal-500/5',
      border: 'border-emerald-500/30',
      textGrad: 'from-emerald-400 to-green-200',
    },
    {
      icon: <Headphones className="w-6 h-6 text-indigo-400" />,
      value: 16.5,
      prefix: '',
      suffix: ' Hrs/Day',
      label: '7:30 AM to 12:00 AM Dedicated Master Desk',
      decimals: 1,
      gradient: 'from-indigo-500/20 to-purple-500/5',
      border: 'border-indigo-500/30',
      textGrad: 'from-indigo-400 to-purple-200',
    },
  ];

  return (
    <section className="relative bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className={`relative rounded-2xl bg-gradient-to-b ${stat.gradient} bg-slate-900/80 border ${stat.border} p-6 backdrop-blur-xl shadow-xl transition-all duration-300 group hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>

              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                <span className={`bg-gradient-to-r ${stat.textGrad} bg-clip-text text-transparent`}>
                  <Counter
                    from={0}
                    to={stat.value}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2.2}
                  />
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimatedStats;
