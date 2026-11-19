'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, ArrowUpRight, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import MuseumRoomHeader from './MuseumRoomHeader';
import SocialMediaHub from './SocialMediaHub';

export default function SocialMediaGallery() {
  const { playAudioCue } = usePortfolio();

  return (
    <section
      id="social-gallery"
      className="relative pt-28 sm:pt-36 pb-28 px-4 sm:px-8 border-t border-[#ec4899]/20 overflow-hidden bg-gradient-to-b from-[#140819]/60 via-[#0f1013] to-[#0f1013]"
    >
      {/* Neon Magenta & Cyan Lounge Architectural Lighting Wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ec4899]/55 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(96vw,900px)] h-96 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.18)_0%,rgba(56,189,248,0.06)_52%,transparent_75%)]" />
      <div className="pointer-events-none absolute bottom-10 -left-24 w-96 h-96 bg-[#ec4899]/[0.08] rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-[#38bdf8]/[0.07] rounded-full blur-[130px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="07"
          wingLabel="SOCIAL MEDIA LOUNGE — NEON MAGENTA WING"
          title="Connect Across"
          accentWord="Every Platform."
          subtitle="A dedicated museum gallery wing for Instagram, Facebook, Pinterest, GitHub, and LinkedIn. Follow along or attach your own live social profile URLs directly."
        />

        {/* Dedicated Full Social Media Connect Lounge */}
        <div
          id="social-media"
          className="museum-plaque rounded-[2rem] p-6 sm:p-9 border border-[#ec4899]/30 shadow-[0_25px_80px_rgba(236,72,153,0.12)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-[#d6c7b2]/14">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.24em] uppercase text-[#ec4899] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ROOM 07 // 5 CONNECTED SOCIAL EXHIBITS</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f0e8] mt-1">
                Social Media <span className="italic text-[#f4a8c4]">Connect Lounge</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#d5cec2]/75 font-light mt-1">
                Click any platform card to visit, click &ldquo;Connect / Edit Links&rdquo; to save your real URLs, or open the standalone <code className="text-[#f4a8c4] font-mono">/socials</code> route.
              </p>
            </div>
            <Link
              href="/socials"
              onClick={() => playAudioCue('click')}
              onMouseEnter={() => playAudioCue('hover')}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ec4899]/18 border border-[#ec4899]/50 hover:bg-[#ec4899] text-[#f9a8d4] hover:text-[#0f1013] text-[11px] font-mono uppercase tracking-wider font-bold transition-all shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Open /socials Route</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <SocialMediaHub />
        </div>
      </div>
    </section>
  );
}

