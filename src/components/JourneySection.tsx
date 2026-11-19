'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Compass, Sparkles, Milestone, ArrowRight, Award, Code2, GraduationCap, Flame, Building2 } from 'lucide-react';

export default function JourneySection() {
  const { data, playAudioCue } = usePortfolio();
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  const journey = data.journey || [];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Origin':
        return 'bg-[#d6c7b2]/15 text-[#e8decb] border-[#d6c7b2]/30 font-semibold';
      case 'Education':
        return 'bg-[#2a2d37]/60 text-[#d5cec2] border-[#8e877c]/30 font-semibold';
      case 'Breakthrough':
        return 'bg-[#d6c7b2]/20 text-[#f5f0e8] border-[#d6c7b2]/40 font-semibold';
      case 'Leadership':
      default:
        return 'bg-[#1c202a] text-[#d6c7b2] border-[#d6c7b2]/30 font-semibold';
    }
  };

  return (
    <section id="journey" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] text-xs font-mono tracking-widest uppercase mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Path & Evolution</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8] mb-6">
            My <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Journey</span> So Far
          </h2>
          <p className="text-base sm:text-lg text-[#d5cec2] font-light leading-relaxed">
            From discovering creative algorithms and building early physics engines to architecting enterprise spatial 3D systems and leading engineering teams.
          </p>
        </div>

        {/* Interactive Timeline Roadmap */}
        <div className="relative">
          {/* Central Vertical Glowing Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#d6c7b2]/50 via-[#8e877c]/30 to-[#d6c7b2]/50 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {journey.map((item, index) => {
              const isEven = index % 2 === 0;
              const isSelected = selectedMilestone === index;

              return (
                <div
                  key={item.year + item.title}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node Badge */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-[#d6c7b2]/40 bg-[#161920] items-center justify-center text-xl shadow-[0_0_20px_rgba(214,199,178,0.15)] z-10 transition-transform duration-300 hover:scale-125">
                    <span>{item.icon}</span>
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-[calc(50%-3rem)]">
                    <div
                      onClick={() => {
                        playAudioCue('click');
                        setSelectedMilestone(isSelected ? null : index);
                      }}
                      onMouseEnter={() => playAudioCue('hover')}
                      className={`group relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                        isSelected
                          ? 'border-[#d6c7b2]/60 bg-[#1c202a]/95 shadow-[0_12px_40px_rgba(214,199,178,0.15)] scale-[1.02]'
                          : 'border-[#d6c7b2]/10 bg-[#161920]/85 hover:border-[#d6c7b2]/35 hover:bg-[#1a1e27] shadow-lg'
                      }`}
                    >
                      {/* Top Header: Year & Category */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-xs font-mono font-bold tracking-wider text-[#d6c7b2]">
                          {item.year}
                        </span>
                        <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadge(item.category)}`}>
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-xl sm:text-2xl font-bold text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-[#8e877c] mb-4 font-mono">
                        {item.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[#d5cec2] leading-relaxed font-light mb-6">
                        {item.description}
                      </p>

                      {/* Skills & Competencies */}
                      {item.skills && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#d6c7b2]/10">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#0f1013] text-[#d5cec2] border border-[#d6c7b2]/15 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
