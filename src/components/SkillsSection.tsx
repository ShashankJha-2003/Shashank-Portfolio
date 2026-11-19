'use client';

import React from 'react';
import { Cpu, Layout, Server, Cloud, Palette, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function SkillsSection() {
  const { data, playAudioCue } = usePortfolio();

  const getCategoryIcon = (category: string) => {
    if (category.includes('Frontend') || category.includes('Creative')) return Layout;
    if (category.includes('Backend') || category.includes('Systems')) return Server;
    if (category.includes('Cloud') || category.includes('Devops')) return Cloud;
    return Palette;
  };

  return (
    <section id="skills" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#d6c7b2] uppercase mb-2">
            <span>[ 03 // TECHNICAL STACK & PROFICIENCY ]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8]">
            Technology <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">I Use</span>
          </h2>
          <p className="text-sm sm:text-base text-[#d5cec2] max-w-xl mt-2 font-normal">
            Core programming languages, modern frontend and 3D visual libraries, backend API frameworks, and cloud deployment tools I utilize daily.
          </p>
        </div>

        {/* Skills Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.skills.map((categoryGroup, idx) => {
            const Icon = getCategoryIcon(categoryGroup.category);
            return (
              <div
                key={idx}
                onMouseEnter={() => playAudioCue('hover')}
                className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#d6c7b2]/10 hover:border-[#d6c7b2]/40 bg-[#161920]/85 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/25 text-[#d6c7b2]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#f5f0e8]">
                        {categoryGroup.category}
                      </h3>
                      <p className="text-xs text-[#8e877c] font-normal">
                        {categoryGroup.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills Progress List */}
                  <div className="mt-6 space-y-4">
                    {categoryGroup.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="group/item">
                        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                          <span className="flex items-center gap-1.5 text-[#d5cec2] group-hover/item:text-[#d6c7b2] transition-colors">
                            {skill.highlight && (
                              <Sparkles className="w-3 h-3 text-[#d6c7b2] shrink-0" />
                            )}
                            <span className={skill.highlight ? 'font-bold text-[#f5f0e8]' : 'font-medium'}>
                              {skill.name}
                            </span>
                          </span>
                          <span className="text-[#8e877c] group-hover/item:text-[#f5f0e8] transition-colors font-semibold">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="w-full h-2 bg-[#0f1013] rounded-full overflow-hidden p-0 border border-[#d6c7b2]/10">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              skill.highlight
                                ? 'bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#998b76] shadow-[0_0_8px_rgba(214,199,178,0.35)]'
                                : 'bg-gradient-to-r from-[#d6c7b2]/90 to-[#8e877c]'
                            }`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#d6c7b2]/10 flex items-center justify-between text-[11px] font-mono text-[#8e877c]">
                  <span>CATEGORY SCORE: ADVANCED</span>
                  <span className="text-[#d6c7b2] font-bold">PRODUCTION READY</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
