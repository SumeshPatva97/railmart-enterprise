'use client';

import React, { useEffect, useState } from 'react';

export function DLoader({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const linkCount = 12;
  const links = Array.from({ length: linkCount }, (_, i) => i);

  const containerSizes = {
    sm: 'w-44 h-44',
    md: 'w-64 h-64',
    lg: 'w-80 h-80',
  };

  const letterSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Ambient background glows with Gold / Amber #f59e0b */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none animate-preloader-glow" />
      <div className="absolute w-60 h-60 rounded-full bg-yellow-500/10 blur-[60px] pointer-events-none" />

      {/* Main Loader Container */}
      <div className={`relative flex items-center justify-center ${containerSizes[size]} select-none`}>
        
        {/* Outer Rotating Braided Circle (Clockwise) */}
        <div className="absolute inset-0 flex items-center justify-center animate-[spin_4.5s_linear_infinite]">
          <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
            <defs>
              {/* Amber #f59e0b to White Gradient */}
              <linearGradient id="braidGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              {/* White to Radiant Amber Gradient */}
              <linearGradient id="braidWhiteGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Deep Bronze Shadow Strand Gradient */}
              <linearGradient id="braidDarkBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="60%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* High intensity gold neon glow filter */}
              <filter id="goldNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Subtle soft glow */}
              <filter id="goldSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Continuous Inner Intertwining Sine Waves */}
            <path
              d={`M ${Array.from({ length: 121 }, (_, i) => {
                const angle = (i * 3 * Math.PI) / 180;
                const r = 86 + 7 * Math.sin(12 * angle);
                const x = (120 + r * Math.cos(angle)).toFixed(2);
                const y = (120 + r * Math.sin(angle)).toFixed(2);
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')} Z`}
              fill="none"
              stroke="url(#braidGoldGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#goldNeonGlow)"
              opacity="0.95"
            />

            <path
              d={`M ${Array.from({ length: 121 }, (_, i) => {
                const angle = (i * 3 * Math.PI) / 180;
                const r = 86 + 7 * Math.sin(12 * angle + Math.PI);
                const x = (120 + r * Math.cos(angle)).toFixed(2);
                const y = (120 + r * Math.sin(angle)).toFixed(2);
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')} Z`}
              fill="none"
              stroke="url(#braidWhiteGoldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            <path
              d={`M ${Array.from({ length: 121 }, (_, i) => {
                const angle = (i * 3 * Math.PI) / 180;
                const r = 86 + 7 * Math.sin(12 * angle + Math.PI / 2);
                const x = (120 + r * Math.cos(angle)).toFixed(2);
                const y = (120 + r * Math.sin(angle)).toFixed(2);
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')} Z`}
              fill="none"
              stroke="url(#braidDarkBronzeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.75"
            />

            {/* Overlapping Braided Links around circle */}
            {links.map((_, i) => {
              const rotation = (i * 360) / linkCount;
              const isEven = i % 2 === 0;
              const isThird = i % 3 === 0;
              return (
                <g key={i} transform={`rotate(${rotation} 120 120)`}>
                  {/* Sinuous curved link ribbon */}
                  <path
                    d="M 112,31 C 117,26 123,26 128,31 C 132,36 128,42 120,41 C 112,40 108,46 112,51"
                    fill="none"
                    stroke={isEven ? 'url(#braidGoldGrad)' : isThird ? '#ffffff' : 'url(#braidWhiteGoldGrad)'}
                    strokeWidth={isEven ? '3.5' : '2.8'}
                    strokeLinecap="round"
                    filter={isEven ? 'url(#goldSoftGlow)' : undefined}
                    opacity={isEven ? '1' : '0.85'}
                  />
                  {/* Subtle braided connector nodule */}
                  <circle
                    cx="120"
                    cy="33"
                    r={isEven ? '2.2' : '1.6'}
                    fill={isEven ? '#f59e0b' : '#ffffff'}
                    filter={isEven ? 'url(#goldNeonGlow)' : undefined}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Counter-Spinning Subtle Ambient Gold Glow Dust */}
        <div className="absolute inset-0 flex items-center justify-center animate-[spin_10s_linear_infinite_reverse] opacity-60 pointer-events-none">
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <circle cx="120" cy="24" r="2.5" fill="#f59e0b" filter="url(#goldNeonGlow)" />
            <circle cx="216" cy="120" r="2.5" fill="#ffffff" filter="url(#goldNeonGlow)" />
            <circle cx="120" cy="216" r="2" fill="#fbbf24" />
            <circle cx="24" cy="120" r="2.5" fill="#f59e0b" filter="url(#goldNeonGlow)" />
            <circle cx="188" cy="52" r="1.5" fill="#fef08a" />
            <circle cx="52" cy="188" r="1.5" fill="#f59e0b" />
          </svg>
        </div>

        {/* Center Stylized "D" with Soft Breathing Gold Glow */}
        <div className="relative z-10 flex items-center justify-center animate-preloader-glow">
          <svg viewBox="0 0 100 100" className={`${letterSizes[size]} overflow-visible`}>
            <defs>
              <linearGradient id="dGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="dGoldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Stylized Modern Flowing "D" Letter Path */}
            <path
              d="M 33,20
                 C 45,18 64,19 75,30
                 C 86,41 88,58 81,72
                 C 74,84 58,88 38,87
                 C 32,87 27,85 27,85
                 L 33,20 Z
                 M 42,32
                 L 42,75
                 C 42,75 52,76 61,71
                 C 70,66 73,54 71,44
                 C 69,34 59,31 46,31
                 L 42,32 Z"
              fill="url(#dGoldGrad)"
              filter="url(#goldNeonGlow)"
              className="drop-shadow-[0_0_14px_rgba(245,158,11,0.85)]"
            />

            {/* Left Sleek Modern Vertical Spine Line */}
            <path
              d="M 28,16 L 28,91"
              stroke="url(#dGoldStroke)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#goldNeonGlow)"
            />

            {/* Sparkling Accent Dots (Matching reference video in Gold) */}
            <circle cx="28" cy="14" r="3.2" fill="#ffffff" filter="url(#goldNeonGlow)" />
            <circle cx="28" cy="93" r="3.2" fill="#f59e0b" filter="url(#goldNeonGlow)" />
            <circle cx="56" cy="21" r="2.5" fill="#ffffff" filter="url(#goldNeonGlow)" />
            <circle cx="85" cy="52" r="2.8" fill="#f59e0b" filter="url(#goldNeonGlow)" />
            <circle cx="73" cy="80" r="2.2" fill="#fbbf24" />
            <circle cx="36" cy="45" r="1.8" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Smooth initial loading duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070b12] transition-all duration-700 ease-out ${
        isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1a1608 0%, #0d0f17 55%, #04060a 100%)',
      }}
      aria-hidden={!isLoading}
    >
      <DLoader size="md" />
    </div>
  );
}
