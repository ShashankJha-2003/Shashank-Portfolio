'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, X, ExternalLink, Sparkles, Landmark, Share2 } from 'lucide-react';

export default function GardenIntroOverlay() {
  const {
    data,
    setHasEnteredGarden,
    gardenStage,
    setGardenStage,
    activeGardenOrbModal,
    setActiveGardenOrbModal,
    playAudioCue,
    setResumeModalOpen,
  } = usePortfolio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Illuminating Museum Facade...');

  // Reset entering state whenever user replays the entrance
  useEffect(() => {
    if (gardenStage === 'exploring' || gardenStage === 'loading') {
      setIsEntering(false);
    }
  }, [gardenStage]);

  // Automated smooth architectural preloading progress -> glides to exterior plaza
  useEffect(() => {
    if (gardenStage !== 'loading') return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingStatus('Grand Doors Open...');
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 14) + 10;
        if (next >= 100) {
          setLoadingStatus('Grand Doors Open...');
          return 100;
        }
        if (next > 72) setLoadingStatus('Preparing 10 Galleries & 9 Turns...');
        else if (next > 42) setLoadingStatus('Lighting the Marble Colonnade...');
        else if (next > 16) setLoadingStatus('Opening the Courtyard Plaza...');
        return next;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [gardenStage]);

  // Smoothly transition from loading bar into the live Museum Exterior welcome screen
  useEffect(() => {
    if (loadingProgress >= 100 && gardenStage === 'loading') {
      const autoEnterTimer = setTimeout(() => {
        playAudioCue('gardenChime');
        setGardenStage('exploring');
      }, 320);

      return () => clearTimeout(autoEnterTimer);
    }
  }, [loadingProgress, gardenStage, playAudioCue, setGardenStage]);

  // Cinematic dolly-zoom fly-through into the illuminated museum doors!
  const handleEnterMuseum = () => {
    if (isEntering) return;
    setIsEntering(true);
    playAudioCue('gardenChime');
    playAudioCue('whoosh');
    window.dispatchEvent(new CustomEvent('museum-enter-flythrough'));

    setTimeout(() => {
      setGardenStage('portfolio');
      setHasEnteredGarden(true);
    }, 920);
  };

  const scrollToSection = (id: string) => {
    playAudioCue('click');
    setMenuOpen(false);
    setGardenStage('portfolio');
    setHasEnteredGarden(true);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  return (
    <>
      {/* ================================================================= */}
      {/* 1. TOP ARCHITECTURAL HEADER                                       */}
      {/* ================================================================= */}
      <header
        className={`fixed top-0 left-0 w-full z-40 px-6 sm:px-12 pt-6 flex items-start justify-between pointer-events-auto transition-opacity duration-500 ${
          isEntering ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left: Minimalist Museum Menu Button */}
        <button
          onClick={() => {
            playAudioCue('click');
            setMenuOpen(!menuOpen);
          }}
          className="flex items-center gap-3 text-[#f5f0e8]/85 hover:text-[#d6c7b2] transition-colors group cursor-pointer"
          aria-label="Toggle Museum Menu"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span className="w-full h-[1px] bg-[#d6c7b2]/85 group-hover:bg-[#f5f0e8] transition-all" />
            <span className="w-4 h-[1px] bg-[#d6c7b2]/85 group-hover:bg-[#f5f0e8] transition-all" />
          </div>
          <span className="text-xs font-mono tracking-[0.22em] uppercase">Directory</span>
        </button>

        {/* Right: Founder & Curator Signature */}
        <div className="text-right flex flex-col items-end">
          <div className="text-sm sm:text-base font-serif font-medium tracking-wide text-[#f5f0e8]">
            {data.personal.name}
          </div>
          <span className="text-[10px] font-mono text-[#d6c7b2] tracking-[0.18em] uppercase">
            Founder &amp; Curator
          </span>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. CINEMATIC ARCHITECTURAL OPENING LOADER                         */}
      {/* ================================================================= */}
      {gardenStage === 'loading' && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between items-center pointer-events-none select-none p-6 sm:p-12 animate-in fade-in duration-700">
          {/* Upper Museum Crest */}
          <div className="mt-14 sm:mt-16 text-center">
            <span className="text-[10px] font-mono tracking-[0.34em] text-[#d6c7b2] uppercase">
              FOUNDED BY {data.personal.name.toUpperCase()}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.1em] text-[#f5f0e8] mt-2 drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)]">
              THE DIGITAL MUSEUM
            </h2>
          </div>

          {/* Center Status Pill */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full">
            <div className="px-6 py-2.5 rounded-full bg-[#090c14]/72 backdrop-blur-xl border border-[#d6c7b2]/30 shadow-2xl flex items-center gap-3">
              <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2] animate-spin" />
              <span className="text-[11px] font-mono tracking-[0.22em] text-[#f5f0e8] uppercase">
                {loadingStatus}
              </span>
            </div>
          </div>

          {/* Bottom Slender Champagne Progress Bar */}
          <div className="w-full max-w-sm pointer-events-auto pb-4">
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#090c14]/75 backdrop-blur-xl border border-[#d6c7b2]/22 shadow-2xl">
              <div className="flex justify-between items-center text-[11px] font-mono text-[#d5cec2]">
                <span className="flex items-center gap-2 tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-[#d6c7b2]" />
                  <span>PREPARING EXHIBITION</span>
                </span>
                <span className="text-[#d6c7b2] font-bold">{loadingProgress}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c8b28e] via-[#f5e7ce] to-[#d6c7b2] transition-all duration-200"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. MUSEUM EXTERIOR ENTRANCE PLAZA OVERLAY                         */}
      {/* ================================================================= */}
      {gardenStage === 'exploring' && (
        <div
          className={`transition-opacity duration-500 ${
            isEntering ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Upper-Center Monumental Museum Title (Framed cleanly in the Twilight Sky above the Roofline!) */}
          <div className="fixed top-7 sm:top-9 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center w-full max-w-3xl px-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#090c14]/65 backdrop-blur-xl border border-[#d6c7b2]/30 mb-3 shadow-[0_8px_28px_rgba(0,0,0,0.65)]">
              <Landmark className="w-3 h-3 text-[#d6c7b2]" />
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.28em] uppercase text-[#e6d5bc] font-semibold">
                FOUNDED BY {data.personal.name.toUpperCase()}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.12em] text-[#fdf9f2] drop-shadow-[0_6px_32px_rgba(0,0,0,0.95)] leading-none">
              THE DIGITAL MUSEUM
            </h1>

            <p className="mt-2 text-xs sm:text-sm font-serif italic tracking-wider text-[#e8dcc8]/90 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              An Exhibition of Ideas, Experiments &amp; Creations.
            </p>
          </div>

          {/* Bottom Floating Entrance Dock (Hovering gracefully over the Reflecting Pool) */}
          <div className="fixed bottom-7 sm:bottom-9 left-1/2 -translate-x-1/2 z-40 pointer-events-auto w-full max-w-xl px-4 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 select-none">
            <div className="px-4 py-1.5 rounded-full bg-[#090c14]/72 backdrop-blur-xl border border-[#d6c7b2]/25 text-center shadow-[0_10px_30px_rgba(0,0,0,0.65)] flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#e5dac7]">
              <Sparkles className="w-3 h-3 text-[#d6c7b2]" />
              <span className="tracking-[0.18em] uppercase">
                Drag to Orbit 3D Museum • Scroll to Zoom • Step Inside
              </span>
            </div>

            {/* Grand Champagne-Gold ENTER MUSEUM CTA */}
            <button
              type="button"
              onClick={handleEnterMuseum}
              onMouseEnter={() => playAudioCue('hover')}
              className="px-9 py-3.5 rounded-full bg-gradient-to-r from-[#e5d6be] via-[#f7ecda] to-[#cbb694] text-[#0c0e13] font-extrabold font-mono text-xs tracking-[0.24em] uppercase shadow-[0_0_40px_rgba(214,199,178,0.55)] hover:shadow-[0_0_65px_rgba(247,236,218,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3 group"
            >
              <span>ENTER THE MUSEUM</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. SLIDE-OUT ARCHITECTURAL DIRECTORY DRAWER (All 10 Galleries)    */}
      {/* ================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 flex justify-start">
          <div className="w-full max-w-md h-full bg-[#0c0e14]/96 border-r border-[#d6c7b2]/18 p-7 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#d6c7b2]/15">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#d6c7b2] block">
                    THE DIGITAL MUSEUM
                  </span>
                  <span className="text-lg font-serif text-[#f5f0e8]">Architectural Directory</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-[#d5cec2]/60 hover:text-[#f5f0e8] cursor-pointer"
                  aria-label="Close directory"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {[
                  { label: '00. Entrance Hall — 3D Centerpiece', id: 'hero' },
                  { label: '01. Introduction Gallery — The Creator', id: 'introduction' },
                  { label: '02. Exhibition Hall — Projects & Demos', id: 'exhibition-hall' },
                  { label: '03. Technology Gallery — Installations', id: 'technology-gallery' },
                  { label: '04. Timeline Gallery — Experience', id: 'timeline-gallery' },
                  { label: '05. Innovation Lab — Experiments', id: 'innovation-lab' },
                  { label: '06. Hobbies Gallery — Passions', id: 'hobbies-gallery' },
                  { label: '07. Social Media Lounge — 5 Channels', id: 'social-gallery' },
                  { label: '08. Floating Showcase — Live Frontends', id: 'floating-showcase' },
                  { label: '09. Exit Gallery — Connect & Guestbook', id: 'exit-gallery' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left py-1.5 text-sm sm:text-base font-serif text-[#f5f0e8]/75 hover:text-[#d6c7b2] hover:translate-x-1.5 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-[#d6c7b2]/45 font-mono">→</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6 mt-6 border-t border-[#d6c7b2]/15 space-y-2.5">
              <Link
                href="/socials"
                onClick={() => {
                  playAudioCue('click');
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-[#f4a8c4]/35 bg-[#f4a8c4]/10 hover:bg-[#f4a8c4] text-xs font-mono text-[#f4a8c4] hover:text-[#0f1013] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open Social Links (/socials)</span>
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setResumeModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl border border-[#d6c7b2]/25 hover:border-[#d6c7b2]/60 text-xs font-mono text-[#d6c7b2] tracking-wider uppercase transition-colors cursor-pointer"
              >
                Curriculum Vitae / Resume
              </button>
              <div className="text-[10px] font-mono text-[#8e877c] text-center pt-1">
                {data.personal.name} • The Digital Museum
              </div>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. OPTIONAL ORB MODAL SHEET                                       */}
      {/* ================================================================= */}
      {activeGardenOrbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0e1017] border border-[#d6c7b2]/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#d6c7b2]/15 pb-4">
              <div>
                <span className="text-xs font-mono text-[#d6c7b2]/70 uppercase tracking-wider">
                  {activeGardenOrbModal.subtitle}
                </span>
                <h3 className="text-2xl font-serif text-[#f5f0e8] mt-1">
                  {activeGardenOrbModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveGardenOrbModal(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-white/75 space-y-4 text-sm font-light leading-relaxed">
              {activeGardenOrbModal.type === 'quote' && (
                <div>
                  <p className="italic text-lg font-serif text-white/90 mb-4">
                    &ldquo;{data.personal.about}&rdquo;
                  </p>
                  <p className="text-xs font-mono text-white/40">
                    — {data.personal.name}, {data.personal.title}
                  </p>
                </div>
              )}

              {activeGardenOrbModal.type === 'project' && data.projects[0] && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="text-lg font-serif font-medium text-white/90">{data.projects[0].title}</div>
                    <p className="text-xs text-white/60 leading-relaxed">{data.projects[0].description}</p>
                    {data.projects[0].liveUrl && (
                      <a
                        href={data.projects[0].liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#d6c7b2] hover:text-white inline-flex items-center gap-1 underline underline-offset-4 pt-1"
                      >
                        <span>Launch Application</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
