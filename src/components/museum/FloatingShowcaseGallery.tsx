'use client';

import React, { useState } from 'react';
import { Sparkles, Monitor, Smartphone, Laptop, Tablet, Tv, Play } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import MuseumRoomHeader from './MuseumRoomHeader';
import ProjectDemoPanel, { ProjectDemoKey } from './ProjectDemoPanel';

interface FloatingProjectCard {
  demoKey: ProjectDemoKey;
  title: string;
  deviceLabel: string;
  accent: string;
  liveUrl: string;
  githubUrl: string;
  delay: string;
  Icon: React.ComponentType<{ className?: string }>;
  previewType: 'vertex' | 'jarvis' | 'netflix' | 'portfolio' | 'calculator';
}

const FLOATING_SHOWCASE_ITEMS: FloatingProjectCard[] = [
  {
    demoKey: 'project-vertex',
    title: 'Vertex Phone X1',
    deviceLabel: 'Floating 3D Smartphone',
    accent: '#34d399',
    liveUrl: 'https://vercel.com',
    githubUrl: 'https://github.com',
    delay: '0s',
    Icon: Smartphone,
    previewType: 'vertex',
  },
  {
    demoKey: 'project-jarvis',
    title: 'J.A.R.V.I.S AI HUD',
    deviceLabel: 'Floating AI Monitor',
    accent: '#38bdf8',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    delay: '0.7s',
    Icon: Monitor,
    previewType: 'jarvis',
  },
  {
    demoKey: 'project-netflix',
    title: 'Netflix UI Clone',
    deviceLabel: 'Floating OLED Cinema',
    accent: '#e50914',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    delay: '1.3s',
    Icon: Tv,
    previewType: 'netflix',
  },
  {
    demoKey: 'project-codsoft-portfolio',
    title: 'CodSoft Portfolio',
    deviceLabel: 'Floating 3D Laptop',
    accent: '#818cf8',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    delay: '0.4s',
    Icon: Laptop,
    previewType: 'portfolio',
  },
  {
    demoKey: 'project-calculator',
    title: 'Scientific Calculator',
    deviceLabel: 'Floating Glass Tablet',
    accent: '#f59e0b',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    delay: '1.0s',
    Icon: Tablet,
    previewType: 'calculator',
  },
];

function MiniFrontendScreen({ type }: { type: FloatingProjectCard['previewType'] }) {
  if (type === 'vertex') {
    return (
      <div className="h-32 rounded-xl bg-gradient-to-br from-[#07151d] via-[#0b232e] to-[#040a0f] border border-emerald-400/35 p-3 flex flex-col justify-between overflow-hidden relative">
        <div className="flex items-center justify-between text-[9px] font-mono text-emerald-300">
          <span>VERTEX X1</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-400/20">60 FPS 3D</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-300 shadow-[0_0_24px_rgba(52,211,153,0.65)] ring-2 ring-cyan-300/40" />
        </div>
        <div className="w-full py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-[#041217] text-[8px] font-mono font-bold text-center">
          EXPLORE 3D PROTOTYPE
        </div>
      </div>
    );
  }
  if (type === 'jarvis') {
    return (
      <div className="h-32 rounded-xl bg-[#05101e] border border-sky-400/35 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between text-[8px] font-mono text-sky-300">
          <span>J.A.R.V.I.S HUD</span>
          <span className="text-emerald-400">● ONLINE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-sky-400/80 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(56,189,248,0.45)]">
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-0.5 h-2 bg-cyan-300" />
              <span className="w-0.5 h-4 bg-sky-300" />
              <span className="w-0.5 h-3 bg-indigo-300" />
              <span className="w-0.5 h-2 bg-cyan-300" />
            </div>
          </div>
          <div className="text-[8px] font-mono text-slate-300 space-y-1 min-w-0">
            <div className="truncate text-indigo-300">&gt; &ldquo;Launch GitHub&rdquo;</div>
            <div className="truncate text-emerald-300">OK • Voice Ready</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[7px] font-mono text-sky-200 text-center">
          <span className="rounded bg-sky-500/15 py-0.5">Weather</span>
          <span className="rounded bg-sky-500/15 py-0.5">Search</span>
          <span className="rounded bg-sky-500/15 py-0.5">Music</span>
        </div>
      </div>
    );
  }
  if (type === 'netflix') {
    return (
      <div className="h-32 rounded-xl bg-gradient-to-b from-[#2b060d] via-[#12070b] to-[#09090b] border border-red-500/40 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black tracking-tight text-red-600">NETFLIX</span>
          <span className="text-[8px] font-mono text-white/60">STREAMING UI</span>
        </div>
        <div>
          <div className="text-[11px] font-extrabold text-white tracking-wide">CYBER HORIZON</div>
          <div className="flex gap-1.5 mt-1">
            <span className="px-2 py-0.5 rounded bg-white text-black text-[8px] font-bold">▶ Play</span>
            <span className="px-2 py-0.5 rounded bg-white/15 text-white text-[8px]">+ List</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <div className="h-5 rounded bg-gradient-to-r from-red-700 to-orange-500" />
          <div className="h-5 rounded bg-gradient-to-r from-blue-700 to-cyan-400" />
          <div className="h-5 rounded bg-gradient-to-r from-purple-700 to-pink-500" />
          <div className="h-5 rounded bg-gradient-to-r from-emerald-700 to-teal-400" />
        </div>
      </div>
    );
  }
  if (type === 'portfolio') {
    return (
      <div className="h-32 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-indigo-400/40 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[8px] font-mono text-indigo-300">&lt;SJ /&gt;</span>
        </div>
        <div>
          <div className="text-[11px] font-bold text-white">Shashank Jha</div>
          <div className="text-[8px] text-indigo-200/80">React • Three.js • Clean UI</div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="h-6 rounded bg-slate-800/90 border border-emerald-400/30" />
          <div className="h-6 rounded bg-slate-800/90 border border-rose-400/30" />
          <div className="h-6 rounded bg-slate-800/90 border border-amber-400/30" />
        </div>
      </div>
    );
  }
  return (
    <div className="h-32 rounded-xl bg-[#0e121b] border border-amber-400/40 p-3 flex flex-col justify-between overflow-hidden">
      <div className="rounded-lg bg-[#07090e] border border-amber-400/30 px-2 py-1.5 text-right font-mono">
        <div className="text-[8px] text-slate-400">sin(45°) × √144</div>
        <div className="text-xs font-bold text-amber-300">8.48528</div>
      </div>
      <div className="grid grid-cols-4 gap-1 text-[8px] font-mono text-center">
        {['sin', '√', 'C', '÷', '7', '8', '9', '='].map((k) => (
          <span
            key={k}
            className={`py-0.5 rounded ${
              k === '=' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-800 text-slate-200'
            }`}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FloatingShowcaseGallery() {
  const { playAudioCue } = usePortfolio();
  const [activeItem, setActiveItem] = useState<FloatingProjectCard>(FLOATING_SHOWCASE_ITEMS[0]);

  return (
    <section
      id="floating-showcase"
      className="relative pt-28 sm:pt-36 pb-28 px-4 sm:px-8 border-t border-[#818cf8]/20 overflow-hidden bg-gradient-to-b from-[#081020]/70 via-[#0f1013] to-[#0f1013]"
    >
      <style jsx>{`
        @keyframes museumFloatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .floating-ui-card {
          animation: museumFloatSlow 4.8s ease-in-out infinite;
        }
      `}</style>

      {/* Luminous Indigo & Arctic Cyan Spatial Lighting Wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#818cf8]/60 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(96vw,920px)] h-96 bg-[radial-gradient(ellipse_at_top,rgba(129,140,248,0.18)_0%,rgba(103,232,249,0.07)_52%,transparent_75%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="08"
          wingLabel="FLOATING SHOWCASE — ZERO-GRAVITY FRONTEND SHOWROOM"
          title="Levitating"
          accentWord="Project Frontends."
          subtitle="Explore every project as a floating 3D device mockup—select any levitating smartphone, monitor, cinema screen, laptop, or tablet to interact with its live frontend below."
        />

        {/* 5 Floating Zero-Gravity Frontend Object Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {FLOATING_SHOWCASE_ITEMS.map((item) => {
            const Icon = item.Icon;
            const isSelected = activeItem.demoKey === item.demoKey;
            return (
              <button
                key={item.demoKey}
                type="button"
                onClick={() => {
                  playAudioCue('click');
                  setActiveItem(item);
                }}
                onMouseEnter={() => playAudioCue('hover')}
                style={{
                  animationDelay: item.delay,
                  borderColor: isSelected ? `${item.accent}cc` : undefined,
                  boxShadow: isSelected ? `0 20px 50px -15px ${item.accent}44` : undefined,
                }}
                className={`floating-ui-card group text-left rounded-2xl p-3.5 border transition-all duration-300 cursor-pointer flex flex-col gap-3 ${
                  isSelected
                    ? 'bg-[#151a2e]/95'
                    : 'bg-[#111524]/85 border-[#818cf8]/20 hover:border-[#818cf8]/60'
                }`}
              >
                <MiniFrontendScreen type={item.previewType} />

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: item.accent }}>
                      <Icon className="w-3 h-3" />
                      {item.deviceLabel}
                    </span>
                    {isSelected && <Play className="w-3 h-3 text-[#818cf8]" />}
                  </div>
                  <div className="font-serif text-lg text-[#f5f0e8] group-hover:text-white leading-tight">
                    {item.title}
                  </div>
                </div>

                {/* Anti-Gravity Floor Glow Strip */}
                <div
                  className="h-1 w-2/3 mx-auto rounded-full opacity-75 blur-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
                />
              </button>
            );
          })}
        </div>

        {/* Interactive Live Frontend Demonstration Stage */}
        <div className="museum-plaque rounded-[2rem] p-6 sm:p-8 border border-[#818cf8]/30 shadow-[0_28px_90px_rgba(8,16,32,0.8)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[#818cf8]/15">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.24em] uppercase text-[#818cf8] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIVE FRONTEND DEMONSTRATION STAGE</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f0e8] mt-1">
                {activeItem.title} <span className="italic text-[#a5b4fc]">— {activeItem.deviceLabel}</span>
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#818cf8]/15 border border-[#818cf8]/40 text-[10px] font-mono uppercase tracking-widest text-[#c7d2fe]">
              Interactive Live Frontend
            </span>
          </div>

          <ProjectDemoPanel
            demoKey={activeItem.demoKey}
            liveUrl={activeItem.liveUrl}
            githubUrl={activeItem.githubUrl}
          />
        </div>
      </div>
    </section>
  );
}

