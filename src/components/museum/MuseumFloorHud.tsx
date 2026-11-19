'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, X, Compass, ArrowUpRight, Sparkles, Share2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export interface MuseumRoomMeta {
  number: string;
  id: string;
  name: string;
  subtitle: string;
  purpose: string;
}

export const MUSEUM_ROOMS: MuseumRoomMeta[] = [
  {
    number: '00',
    id: 'hero',
    name: 'Entrance Hall',
    subtitle: 'Welcome Gallery',
    purpose: 'First impression & interactive 3D founder showcase',
  },
  {
    number: '01',
    id: 'introduction',
    name: 'Introduction Gallery',
    subtitle: 'The Person Behind the Projects',
    purpose: 'The Creator, The Journey & The Philosophy Wall',
  },
  {
    number: '02',
    id: 'exhibition-hall',
    name: 'Exhibition Hall',
    subtitle: 'Featured Projects',
    purpose: 'Interactive 3D displays & architectural exhibit plaques',
  },
  {
    number: '03',
    id: 'technology-gallery',
    name: 'Technology Gallery',
    subtitle: 'Interactive Installations',
    purpose: 'Live Three.js, React, GSAP & engineering displays',
  },
  {
    number: '04',
    id: 'timeline-gallery',
    name: 'Timeline Gallery',
    subtitle: 'Professional Experience',
    purpose: 'Illuminated corridor of chapters, internships & credentials',
  },
  {
    number: '05',
    id: 'innovation-lab',
    name: 'Innovation Lab',
    subtitle: 'Beyond the Exhibitions',
    purpose: 'Interactive experiments, shaders & research notebooks',
  },
  {
    number: '06',
    id: 'hobbies-gallery',
    name: 'Hobbies Gallery',
    subtitle: 'Passions Beyond Code',
    purpose: 'WebGL shaders, Python AI, Java DSA, Cricket, Reading & Writing',
  },
  {
    number: '07',
    id: 'social-gallery',
    name: 'Social Media Lounge',
    subtitle: 'Neon Magenta Connect Wing',
    purpose: 'Instagram, Facebook, Pinterest, GitHub & LinkedIn with live link editor',
  },
  {
    number: '08',
    id: 'floating-showcase',
    name: 'Floating Showcase',
    subtitle: 'Zero-Gravity Frontend Showroom',
    purpose: 'Levitating 3D laptops, phones, monitors & tablets displaying live project frontends',
  },
  {
    number: '09',
    id: 'exit-gallery',
    name: 'Exit Gallery',
    subtitle: 'Connect & Collaborate',
    purpose: 'Direct contact, resume archive & guestbook dispatch',
  },
];

export default function MuseumFloorHud() {
  const { playAudioCue, setResumeModalOpen } = usePortfolio();
  const [activeRoom, setActiveRoom] = useState<MuseumRoomMeta>(MUSEUM_ROOMS[0]);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const viewportMid = window.innerHeight * 0.42;
      for (let i = MUSEUM_ROOMS.length - 1; i >= 0; i--) {
        const room = MUSEUM_ROOMS[i];
        const el = document.getElementById(room.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMid) {
            setActiveRoom(room);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToRoom = (id: string) => {
    playAudioCue('click');
    setMapOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Minimal Architectural Museum Floor HUD (Inspired by Gallery Navigation) */}
      <div className="fixed bottom-5 left-5 right-5 z-40 pointer-events-none flex items-center justify-between gap-3">
        {/* Bottom-Left: Live Current Room Plaque */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-[#12141a]/90 backdrop-blur-xl border border-[#d6c7b2]/20 shadow-[0_12px_35px_rgba(0,0,0,0.75)]">
          <span className="w-6 h-6 rounded-full border border-[#d6c7b2]/45 bg-[#d6c7b2]/10 flex items-center justify-center font-mono text-[10px] font-bold text-[#d6c7b2]">
            {activeRoom.number}
          </span>
          <div className="flex flex-col leading-tight pr-1">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f5f0e8] font-semibold">
              {activeRoom.name}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#d6c7b2]/65 uppercase">
              {activeRoom.subtitle}
            </span>
          </div>
        </div>

        {/* Bottom-Center: Architectural Floor Map Pill */}
        <div className="pointer-events-auto mx-auto sm:mx-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setMapOpen(true);
            }}
            onMouseEnter={() => playAudioCue('hover')}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#151821]/92 backdrop-blur-xl border border-[#d6c7b2]/30 hover:border-[#d6c7b2]/70 text-[#f5f0e8] hover:text-[#d6c7b2] shadow-[0_12px_35px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer group"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold">
              Museum Map
            </span>
            <span className="w-[1px] h-3.5 bg-[#d6c7b2]/25" />
            <LayoutGrid className="w-3.5 h-3.5 text-[#d6c7b2] group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <Link
            href="/socials"
            onClick={() => playAudioCue('click')}
            onMouseEnter={() => playAudioCue('hover')}
            title="Open Dedicated /socials Page"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#151821]/92 backdrop-blur-xl border border-[#f4a8c4]/35 hover:border-[#f4a8c4]/85 hover:bg-[#f4a8c4] text-[#f4a8c4] hover:text-[#0f1013] shadow-[0_12px_35px_rgba(0,0,0,0.8)] transition-all duration-300 font-mono text-[11px] tracking-[0.18em] uppercase font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Socials</span>
          </Link>
        </div>

        {/* Bottom-Right: Room Progress Dots */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#12141a]/90 backdrop-blur-xl border border-[#d6c7b2]/15 shadow-[0_12px_35px_rgba(0,0,0,0.75)]">
          {MUSEUM_ROOMS.map((room) => {
            const isActive = room.id === activeRoom.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => navigateToRoom(room.id)}
                title={`Room ${room.number} — ${room.name}`}
                aria-label={`Jump to Room ${room.number} ${room.name}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-6 bg-[#d6c7b2] shadow-[0_0_10px_rgba(214,199,178,0.55)]'
                    : 'w-2 bg-[#d6c7b2]/25 hover:bg-[#d6c7b2]/60'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Architectural Floor Plan Modal */}
      {mapOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg"
          onClick={() => setMapOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl museum-plaque p-6 sm:p-9 overflow-hidden"
          >
            {/* Overhead Ambient Light */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-[#d6c7b2]/12 blur-3xl" />

            <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#d6c7b2]/15">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#d6c7b2] mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Architectural Directory // 10 Galleries</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5f0e8]">
                  The Digital Museum <span className="italic text-[#d6c7b2]">Floor Plan</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  playAudioCue('click');
                  setMapOpen(false);
                }}
                className="p-2.5 rounded-full border border-[#d6c7b2]/20 bg-[#0f1013] text-[#d5cec2] hover:text-[#f5f0e8] hover:border-[#d6c7b2]/55 transition-colors cursor-pointer"
                aria-label="Close Museum Floor Plan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 7-Room Interactive Architectural Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6 max-h-[62vh] overflow-y-auto pr-1">
              {MUSEUM_ROOMS.map((room) => {
                const isCurrent = room.id === activeRoom.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => navigateToRoom(room.id)}
                    onMouseEnter={() => playAudioCue('hover')}
                    className={`group text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                      isCurrent
                        ? 'border-[#d6c7b2]/65 bg-[#1c202a] shadow-[0_0_25px_rgba(214,199,178,0.14)]'
                        : 'border-[#d6c7b2]/12 bg-[#12141a]/90 hover:border-[#d6c7b2]/45 hover:bg-[#181b24]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] font-bold">
                        ROOM {room.number}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#d6c7b2]/50 group-hover:text-[#d6c7b2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <div>
                      <div className="font-serif text-xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                        {room.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#d6c7b2]/75 uppercase tracking-wider mt-0.5">
                        {room.subtitle}
                      </div>
                      <p className="text-xs text-[#d5cec2]/70 font-light mt-2 leading-relaxed">
                        {room.purpose}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Bar in Floor Plan */}
            <div className="mt-6 pt-5 border-t border-[#d6c7b2]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#d5cec2]/65">
                <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2]" />
                <span>Curated by Shashank Jha • Click any gallery to enter</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/socials"
                  onClick={() => {
                    playAudioCue('click');
                    setMapOpen(false);
                  }}
                  className="px-4 py-2 rounded-full border border-[#f4a8c4]/40 bg-[#f4a8c4]/12 text-[#f4a8c4] hover:bg-[#f4a8c4] hover:text-[#0f1013] text-xs font-mono font-semibold tracking-wider uppercase transition-all inline-flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Links (/socials)</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    playAudioCue('click');
                    setMapOpen(false);
                    setResumeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full border border-[#d6c7b2]/35 bg-[#d6c7b2]/10 text-[#d6c7b2] hover:bg-[#d6c7b2] hover:text-[#0f1013] text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Open Curator&apos;s Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

