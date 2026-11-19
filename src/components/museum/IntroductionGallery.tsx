'use client';

import React, { useState } from 'react';
import { MapPin, GraduationCap, Sparkles, Quote, Compass } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { withBasePath } from '../../lib/assetPath';
import MuseumRoomHeader from './MuseumRoomHeader';

export default function IntroductionGallery() {
  const { data, playAudioCue } = usePortfolio();
  const journey = data.journey || [];
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(journey.length - 1);

  return (
    <section
      id="introduction"
      className="relative py-28 sm:py-36 px-4 sm:px-8 border-t border-[#d6c7b2]/10 overflow-hidden"
    >
      {/* Ambient Architectural Floor Lighting */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d6c7b2]/35 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="01"
          wingLabel="INTRODUCTION GALLERY"
          title="The Person Behind"
          accentWord="The Projects"
          subtitle="Step past the entrance into the identity wing—three curated exhibits revealing the creator, the milestones that shaped his craft, and the philosophy inscribed on the gallery wall."
        />

        {/* =============================================================== */}
        {/* EXHIBIT 001 — THE CREATOR                                       */}
        {/* =============================================================== */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.22em] uppercase border border-[#d6c7b2]/35 bg-[#d6c7b2]/10 text-[#d6c7b2] font-bold">
              EXHIBIT 001
            </span>
            <span className="text-xs font-mono tracking-[0.18em] uppercase text-[#d5cec2]/70">
              THE CREATOR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#d6c7b2]/25 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Arched Gallery Portrait Pedestal */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 min-h-[380px] rounded-3xl museum-plaque p-5 flex flex-col items-center justify-between overflow-hidden group">
                <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-44 bg-[#d6c7b2]/18 blur-3xl group-hover:bg-[#d6c7b2]/28 transition-colors duration-500" />

                {/* Architectural Stone Arch Vitrine */}
                <div className="relative w-full max-w-[270px] aspect-[3/4] museum-arch-frame overflow-hidden border border-[#d6c7b2]/30 bg-[#0f1013] shadow-[0_25px_55px_rgba(0,0,0,0.85)] mt-2">
                  <img
                    src={withBasePath('/face_3d_poster.jpg')}
                    alt="Shashank Jha — Founder of The Digital Museum"
                    className="w-full h-full object-cover object-top scale-[1.03] group-hover:scale-[1.06] transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0f1013] via-[#0f1013]/50 to-transparent" />
                </div>

                {/* Brass-style Portrait Pedestal Plaque */}
                <div className="w-full mt-5 pt-4 border-t border-[#d6c7b2]/15 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-serif text-xl text-[#f5f0e8]">{data.personal.name}</div>
                    <div className="text-[10px] font-mono tracking-widest uppercase text-[#d6c7b2]">
                      Frontend Developer | Tech Enthusiast
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded border border-[#d6c7b2]/25 bg-[#0f1013] text-[#d5cec2]">
                    EST. 2022
                  </span>
                </div>
              </div>
            </div>

            {/* Creator Curatorial Dossier */}
            <div className="lg:col-span-7 flex flex-col justify-between museum-plaque rounded-3xl p-7 sm:p-10 relative overflow-hidden">
              <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-[#d6c7b2]/[0.05] rounded-full blur-3xl" />

              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-[#d6c7b2] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curator&apos;s Profile</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5f0e8] mb-2">
                  {data.personal.name}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[#d6c7b2]/90 tracking-wide mb-6">
                  {data.personal.title}
                </p>

                <p className="text-sm sm:text-base text-[#d5cec2] leading-relaxed font-light mb-5">
                  {data.personal.about}
                </p>

                <div className="space-y-3 mb-7">
                  {data.personal.bioParagraphs.map((para, i) => (
                    <p key={i} className="text-sm text-[#d5cec2]/80 leading-relaxed font-light">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Museum Fact Plaque Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-[#d6c7b2]/15">
                <div className="p-3.5 rounded-xl bg-[#0f1013]/90 border border-[#d6c7b2]/12 flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-[#d6c7b2] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#8e877c]">
                      Academic Wing
                    </div>
                    <div className="text-xs font-medium text-[#f5f0e8]">
                      B.Tech CSE • Parul University (2022–2026)
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f1013]/90 border border-[#d6c7b2]/12 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#d6c7b2] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#8e877c]">
                      Studio Location
                    </div>
                    <div className="text-xs font-medium text-[#f5f0e8]">
                      {data.personal.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* EXHIBIT 002 — THE JOURNEY                                       */}
        {/* =============================================================== */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.22em] uppercase border border-[#d6c7b2]/35 bg-[#d6c7b2]/10 text-[#d6c7b2] font-bold">
              EXHIBIT 002
            </span>
            <span className="text-xs font-mono tracking-[0.18em] uppercase text-[#d5cec2]/70">
              THE JOURNEY — MILESTONE DISPLAYS
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#d6c7b2]/25 to-transparent" />
          </div>

          {/* Interactive Illuminated Milestone Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {journey.map((item, idx) => {
              const isActive = idx === activeMilestoneIdx;
              return (
                <button
                  key={item.year + item.title}
                  type="button"
                  onClick={() => {
                    playAudioCue('click');
                    setActiveMilestoneIdx(idx);
                  }}
                  onMouseEnter={() => playAudioCue('hover')}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'border-[#d6c7b2]/65 bg-[#1b1f29] shadow-[0_0_30px_rgba(214,199,178,0.14)] -translate-y-1'
                      : 'border-[#d6c7b2]/12 bg-[#13151b]/90 hover:border-[#d6c7b2]/35'
                  }`}
                >
                  {isActive && (
                    <div className="pointer-events-none absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d6c7b2] to-transparent" />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#d6c7b2]">{item.year}</span>
                    <span className="text-base">{item.icon}</span>
                  </div>
                  <div className="font-serif text-base text-[#f5f0e8] leading-snug line-clamp-2">
                    {item.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Illuminated Milestone Showcase Pedestal */}
          {journey[activeMilestoneIdx] && (
            <div className="museum-plaque rounded-3xl p-7 sm:p-9 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-20 left-1/3 w-96 h-48 bg-[#d6c7b2]/10 blur-3xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-[#d6c7b2] font-bold">
                      <Compass className="w-3.5 h-3.5" />
                      YEAR {journey[activeMilestoneIdx].year}
                    </span>
                    <span className="text-[#d6c7b2]/30">•</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#f5f0e8]">
                      {journey[activeMilestoneIdx].category}
                    </span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl text-[#f5f0e8] mb-1.5">
                    {journey[activeMilestoneIdx].title}
                  </h4>
                  <p className="text-xs font-mono text-[#d6c7b2]/80 mb-4">
                    {journey[activeMilestoneIdx].tagline}
                  </p>
                  <p className="text-sm sm:text-base text-[#d5cec2]/85 font-light leading-relaxed">
                    {journey[activeMilestoneIdx].description}
                  </p>
                </div>

                {journey[activeMilestoneIdx].skills && (
                  <div className="md:w-72 shrink-0 p-5 rounded-2xl bg-[#0f1013]/85 border border-[#d6c7b2]/12">
                    <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c] mb-3">
                      Artifacts &amp; Foundations
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {journey[activeMilestoneIdx].skills?.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#161922] border border-[#d6c7b2]/18 text-[#e8decb]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* =============================================================== */}
        {/* EXHIBIT 003 — THE PHILOSOPHY (MONUMENTAL MUSEUM WALL)           */}
        {/* =============================================================== */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.22em] uppercase border border-[#d6c7b2]/35 bg-[#d6c7b2]/10 text-[#d6c7b2] font-bold">
              EXHIBIT 003
            </span>
            <span className="text-xs font-mono tracking-[0.18em] uppercase text-[#d5cec2]/70">
              THE PHILOSOPHY — MONUMENTAL WALL INSCRIPTION
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#d6c7b2]/25 to-transparent" />
          </div>

          <div className="relative rounded-[2rem] museum-stone-wall border border-[#d6c7b2]/20 px-6 py-16 sm:px-14 sm:py-24 text-center overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
            {/* Architectural Gallery Track Spotlights */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-72 bg-[radial-gradient(ellipse_at_top,rgba(236,227,212,0.18)_0%,rgba(214,199,178,0.05)_48%,transparent_75%)]" />
            <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-16 opacity-60">
              <span className="w-8 h-1 rounded-full bg-[#ece3d4]/60 shadow-[0_0_16px_rgba(236,227,212,0.8)]" />
              <span className="w-8 h-1 rounded-full bg-[#ece3d4]/60 shadow-[0_0_16px_rgba(236,227,212,0.8)]" />
            </div>

            {/* Subtle Architectural Corner Trim */}
            <div className="pointer-events-none absolute top-6 left-6 w-6 h-6 border-t border-l border-[#d6c7b2]/30" />
            <div className="pointer-events-none absolute top-6 right-6 w-6 h-6 border-t border-r border-[#d6c7b2]/30" />
            <div className="pointer-events-none absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#d6c7b2]/30" />
            <div className="pointer-events-none absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#d6c7b2]/30" />

            <Quote className="w-8 h-8 text-[#d6c7b2]/45 mx-auto mb-6" />

            <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light italic leading-[1.24] text-[#f5f0e8] max-w-4xl mx-auto tracking-tight">
              &ldquo;Built by experiences, guided by principles, and driven by dreams that refuse to fade.&rdquo;
            </blockquote>

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="w-10 h-px bg-[#d6c7b2]/35" />
              <span className="text-[11px] font-mono tracking-[0.26em] uppercase text-[#d6c7b2]">
                {data.personal.name} // GALLERY INSCRIPTION
              </span>
              <div className="w-10 h-px bg-[#d6c7b2]/35" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

