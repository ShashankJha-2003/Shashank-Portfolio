'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Award, BookOpen, Calendar, MapPin, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

export default function EducationSection() {
  const { data, playAudioCue } = usePortfolio();
  const [activeCert, setActiveCert] = useState<number | null>(null);

  const education = data.education || [];
  const certifications = data.certifications || [];

  return (
    <section id="education" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] text-xs font-mono tracking-widest uppercase mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic & Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8] mb-6">
            Education & <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Certifications</span>
          </h2>
          <p className="text-base sm:text-lg text-[#d5cec2] font-light leading-relaxed">
            My formal engineering foundation in Computer Science & Engineering, complemented by accredited courses, industry internships, and specialized technical workshops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Degree & University (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-mono tracking-wider uppercase text-[#f5f0e8]/80 flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#d6c7b2]" />
              <span>Degree & University</span>
            </h3>

            {education.map((edu, idx) => (
              <div
                key={idx}
                className="relative p-7 sm:p-9 rounded-2xl border border-[#d6c7b2]/10 bg-[#161920]/85 backdrop-blur-xl shadow-xl hover:border-[#d6c7b2]/40 transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono tracking-widest uppercase text-[#0f1013] font-bold bg-[#d6c7b2] px-3 py-1 rounded-full shadow-sm">
                      {edu.score || 'Pursuing'}
                    </span>
                    <h4 className="text-2xl font-bold text-[#f5f0e8] mt-2.5 group-hover:text-[#d6c7b2] transition-colors">
                      {edu.degree}
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8e877c]">
                      <Calendar className="w-3.5 h-3.5 text-[#d6c7b2]" />
                      {edu.period}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#d5cec2] font-medium mb-6">
                  <MapPin className="w-4 h-4 text-[#d6c7b2]" />
                  <span>{edu.institution}</span>
                </div>

                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="space-y-3 pt-6 border-t border-[#d6c7b2]/10">
                    <span className="text-xs font-mono text-[#8e877c] uppercase tracking-wider block font-semibold">
                      Key Coursework & Highlights:
                    </span>
                    <ul className="space-y-2.5">
                      {edu.highlights.map((item, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-sm text-[#d5cec2] font-light leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#d6c7b2] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Verified Certifications (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-mono tracking-wider uppercase text-[#f5f0e8]/80 flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#d6c7b2]" />
              <span>Certifications & Accreditations</span>
            </h3>

            <div className="space-y-3.5">
              {certifications.map((cert, cIdx) => (
                <div
                  key={cIdx}
                  onClick={() => {
                    playAudioCue('click');
                    setActiveCert(activeCert === cIdx ? null : cIdx);
                  }}
                  onMouseEnter={() => playAudioCue('hover')}
                  className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                    activeCert === cIdx
                      ? 'border-[#d6c7b2]/60 bg-[#1c202a]/95 shadow-[0_8px_25px_rgba(214,199,178,0.15)]'
                      : 'border-[#d6c7b2]/10 bg-[#161920]/75 hover:border-[#d6c7b2]/30 hover:bg-[#1a1e27]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#d6c7b2]/10 border border-[#d6c7b2]/25 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-[#d6c7b2]" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                          {cert.title}
                        </h5>
                        <p className="text-xs text-[#8e877c] font-mono mt-1">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#d6c7b2] shrink-0">
                      {cert.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
