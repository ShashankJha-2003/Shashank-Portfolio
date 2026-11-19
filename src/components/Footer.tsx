'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart, Code2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Footer() {
  const { data, playAudioCue } = usePortfolio();
  const [timeString, setTimeString] = useState('');
  const [currentYear, setCurrentYear] = useState('2026');

  useEffect(() => {
    const now = new Date();
    setCurrentYear(String(now.getFullYear()));
    const updateTime = () => {
      const current = new Date();
      setTimeString(
        current.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    playAudioCue('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#d6c7b2]/10 bg-[#0f1013]/95 py-12 px-4 sm:px-8 overflow-hidden z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d6c7b2] via-[#e8decb] to-[#8e877c] p-[1.5px]">
            <div className="w-full h-full rounded-full bg-[#0f1013] flex items-center justify-center font-mono font-bold text-xs text-[#f5f0e8]">
              {data.personal.name.split(' ').map(n => n[0]).join('') || 'SJ'}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-[#f5f0e8] tracking-tight">
              {data.personal.name}
            </div>
            <div className="text-xs font-mono text-[#d6c7b2] font-medium">
              {data.personal.title}
            </div>
          </div>
        </div>

        {/* Center: System Clock & Tech Tags */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d6c7b2] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#d6c7b2] animate-ping" />
            <span>SYSTEM ACTIVE // {timeString || 'ONLINE'}</span>
          </div>
          <div className="text-[11px] font-mono text-[#8e877c] flex items-center gap-1">
            <span>React 19</span> • <span>Next.js 16</span> • <span>Three.js</span> • <span>GSAP</span>
          </div>
        </div>

        {/* Right: Scroll to top button */}
        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            onMouseEnter={() => playAudioCue('hover')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#161920] border border-[#d6c7b2]/15 hover:border-[#d6c7b2]/50 hover:text-[#d6c7b2] text-xs font-mono text-[#d5cec2] transition-all cursor-pointer group shadow-md"
          >
            <span>Back to Summit</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#d6c7b2]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8e877c] font-mono gap-2 text-center">
        <div>
          © {currentYear} {data.personal.name}. All creative and intellectual rights reserved.
        </div>
        <div className="flex items-center gap-1 text-[#8e877c]/80 font-medium">
          <span>Crafted with passion & precision • Portfolio 2026</span>
        </div>
      </div>
    </footer>
  );
}
