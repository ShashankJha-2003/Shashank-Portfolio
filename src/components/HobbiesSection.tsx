'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Heart, Sparkles, Compass, Lightbulb, Activity, ArrowUpRight } from 'lucide-react';

export default function HobbiesSection() {
  const { data, playAudioCue } = usePortfolio();
  const [activeHobby, setActiveHobby] = useState<string | null>(null);

  const hobbies = data.hobbies || [];

  return (
    <section id="hobbies" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] text-xs font-mono tracking-widest uppercase mb-4">
            <Heart className="w-3.5 h-3.5 text-[#d6c7b2]" />
            <span>Passions Beyond The Terminal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8] mb-6">
            Hobbies & <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Creative Interests</span>
          </h2>
          <p className="text-base sm:text-lg text-[#d5cec2] font-light leading-relaxed">
            What fuels my creativity outside work—from experimental 3D canvas shaders and Python AI bots to cricket matches and community tech sharing.
          </p>
        </div>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies.map((hobby) => {
            const isExpanded = activeHobby === hobby.id;

            return (
              <div
                key={hobby.id}
                onClick={() => {
                  playAudioCue('click');
                  setActiveHobby(isExpanded ? null : hobby.id);
                }}
                onMouseEnter={() => playAudioCue('hover')}
                className={`relative p-7 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-xl flex flex-col justify-between ${
                  isExpanded
                    ? 'border-[#d6c7b2]/60 bg-[#1c202a]/95 shadow-[0_12px_35px_rgba(214,199,178,0.15)] scale-[1.02]'
                    : 'border-[#d6c7b2]/10 bg-[#161920]/80 hover:border-[#d6c7b2]/35 hover:bg-[#1a1e27] shadow-lg'
                }`}
              >
                <div>
                  {/* Top Bar: Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 flex items-center justify-center text-2xl shadow-inner">
                      {hobby.icon}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] font-semibold">
                      {hobby.badge}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-xl font-bold text-[#f5f0e8] mb-2 group-hover:text-[#d6c7b2] transition-colors">
                    {hobby.title}
                  </h3>
                  <span className="text-xs font-mono text-[#8e877c] tracking-wider block mb-4">
                    {hobby.category}
                  </span>

                  {/* Description */}
                  <p className="text-sm text-[#d5cec2] leading-relaxed font-light mb-4">
                    {hobby.description}
                  </p>
                </div>

                {/* Expanded Details */}
                {hobby.details && (
                  <div className="pt-4 border-t border-[#d6c7b2]/10 mt-4">
                    <span className="text-[11px] font-mono text-[#8e877c] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2]" />
                      <span>{hobby.details}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
