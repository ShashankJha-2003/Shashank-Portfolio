'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function ExperienceSection() {
  const { data, playAudioCue } = usePortfolio();

  return (
    <section id="experience" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#d6c7b2] uppercase mb-2">
            <span>[ 05 // WORK EXPERIENCE ]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8]">
            Professional <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-sm sm:text-base text-[#d5cec2] max-w-xl mt-2 font-normal">
            Track record of building responsive frontend interfaces, Three.js 3D prototypes, full-stack applications, and Git collaboration workflows.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l border-[#d6c7b2]/20 ml-4 md:ml-8 pl-6 md:pl-10 space-y-12">
          {data.experience.map((exp) => (
            <div
              key={exp.id}
              onMouseEnter={() => playAudioCue('hover')}
              className="relative group"
            >
              {/* Glowing timeline node */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#0f1013] border-2 border-[#d6c7b2] group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(214,199,178,0.5)] transition-all duration-300 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d6c7b2]" />
              </div>

              {/* Experience Card */}
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-[#d6c7b2]/10 hover:border-[#d6c7b2]/40 transition-all duration-300 bg-[#161920]/95 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-sm font-semibold text-[#d6c7b2] flex items-center gap-2 mt-0.5">
                      <span className="text-[#f5f0e8] font-bold">{exp.company}</span>
                      <span className="text-[#8e877c]">•</span>
                      <span className="text-xs font-mono text-[#8e877c] flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#d6c7b2]" /> {exp.location}
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#0f1013] border border-[#d6c7b2]/15 text-[#d5cec2] self-start sm:self-auto font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#d6c7b2]" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="text-sm text-[#d5cec2] mb-5 leading-relaxed font-normal">
                  {exp.description}
                </p>

                {/* Key Achievements Bullet points */}
                <div className="space-y-2.5 mb-6">
                  {exp.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#d5cec2] leading-relaxed font-normal">
                      <CheckCircle2 className="w-4 h-4 text-[#d6c7b2] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#d6c7b2]/10">
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0f1013] text-[#d5cec2] border border-[#d6c7b2]/15 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
