'use client';

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import MuseumRoomHeader from './MuseumRoomHeader';

export default function HobbiesGallery() {
  const { data, playAudioCue } = usePortfolio();

  return (
    <section
      id="hobbies-gallery"
      className="relative py-28 sm:py-36 px-4 sm:px-8 border-t border-[#fb7185]/15 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#fb7185]/45 to-transparent" />
      <div className="pointer-events-none absolute top-24 right-1/4 w-[480px] h-[480px] bg-[#fb7185]/[0.06] rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="06"
          wingLabel="HOBBIES & PASSIONS — ATELIER"
          title="Beyond"
          accentWord="Code"
          subtitle="Every creator is fueled by curiosity outside formal projects—from WebGL shaders and Python AI tinkering to competitive cricket and technical mentorship."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.hobbies || []).map((hobby, idx) => (
            <div
              key={hobby.id}
              onMouseEnter={() => playAudioCue('hover')}
              className="group relative rounded-3xl museum-plaque p-6 sm:p-7 border border-[#fb7185]/18 hover:border-[#fb7185]/55 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="w-12 h-12 rounded-2xl bg-[#1a151e] border border-[#fb7185]/30 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(251,113,133,0.18)] group-hover:scale-110 transition-transform duration-300">
                    {hobby.icon}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase bg-[#fb7185]/12 border border-[#fb7185]/35 text-[#fda4af] font-bold">
                    {hobby.badge}
                  </span>
                </div>

                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8e877c] mb-1">
                  PASSION {String(idx + 1).padStart(2, '0')} // {hobby.category}
                </div>
                <h3 className="font-serif text-2xl text-[#f5f0e8] group-hover:text-[#fda4af] transition-colors mb-3 leading-snug">
                  {hobby.title}
                </h3>
                <p className="text-sm text-[#d5cec2]/80 font-light leading-relaxed mb-4">
                  {hobby.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d6c7b2]/10 flex items-start gap-2 text-xs text-[#d6c7b2]/80 font-light">
                <Sparkles className="w-3.5 h-3.5 text-[#fb7185] shrink-0 mt-0.5" />
                <span>{hobby.details}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14151c]/90 border border-[#fb7185]/25 text-[11px] font-mono text-[#d5cec2]/85">
            <Heart className="w-3.5 h-3.5 text-[#fb7185]" />
            <span>Curiosity outside the IDE powers creativity inside every build.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
