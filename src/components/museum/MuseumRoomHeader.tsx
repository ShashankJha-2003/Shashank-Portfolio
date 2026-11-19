'use client';

import React from 'react';

interface MuseumRoomHeaderProps {
  roomNumber: string;
  wingLabel: string;
  title: string;
  accentWord?: string;
  subtitle: string;
  accentTone?: 'gold' | 'cyan' | 'violet';
  align?: 'center' | 'left';
}

export default function MuseumRoomHeader({
  roomNumber,
  wingLabel,
  title,
  accentWord,
  subtitle,
  accentTone = 'gold',
  align = 'center',
}: MuseumRoomHeaderProps) {
  const spotlightGradient =
    accentTone === 'cyan'
      ? 'from-[#38bdf8]/16 via-[#d6c7b2]/5 to-transparent'
      : accentTone === 'violet'
      ? 'from-[#a78bfa]/14 via-[#d6c7b2]/5 to-transparent'
      : 'from-[#d6c7b2]/16 via-[#d6c7b2]/5 to-transparent';

  const borderTone =
    accentTone === 'cyan'
      ? 'border-[#38bdf8]/30 text-[#7dd3fc]'
      : accentTone === 'violet'
      ? 'border-[#a78bfa]/30 text-[#c4b5fd]'
      : 'border-[#d6c7b2]/30 text-[#d6c7b2]';

  const isCenter = align === 'center';

  return (
    <div className="relative mb-16 sm:mb-20">
      {/* Overhead Architectural Gallery Spotlight Cone */}
      <div
        className={`pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[min(92vw,760px)] h-64 bg-gradient-to-b ${spotlightGradient} blur-3xl -z-10`}
      />

      {/* Architectural Archway Portal Motif */}
      <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#d6c7b2]/45" />
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border bg-[#13151b]/90 backdrop-blur-md text-[11px] font-mono tracking-[0.22em] uppercase ${borderTone}`}
          >
            <span className="font-bold">ROOM {roomNumber}</span>
            <span className="opacity-40">//</span>
            <span className="text-[#f5f0e8]/90">{wingLabel}</span>
          </div>
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#d6c7b2]/45" />
        </div>

        {/* Minimal Stone Arch Threshold Indicator */}
        <div
          className={`w-14 h-7 museum-arch-frame border-t border-x border-[#d6c7b2]/30 mb-5 flex items-end justify-center pb-1 bg-gradient-to-b from-[#d6c7b2]/10 to-transparent ${
            isCenter ? 'mx-auto' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d6c7b2]/80" />
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#f5f0e8] leading-[1.08] mb-4">
          {title}{' '}
          {accentWord && (
            <span className="italic font-normal bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a89a84] bg-clip-text text-transparent">
              {accentWord}
            </span>
          )}
        </h2>

        <p
          className={`text-sm sm:text-base text-[#d5cec2]/80 font-light leading-relaxed max-w-2xl ${
            isCenter ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

