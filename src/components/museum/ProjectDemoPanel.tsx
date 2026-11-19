'use client';

import React, { useState } from 'react';
import {
  Play,
  Terminal,
  Smartphone,
  Calculator,
  Tv,
  Monitor,
  Tablet,
  ExternalLink,
  Sparkles,
  Send,
  RotateCcw,
} from 'lucide-react';
import { GithubIcon } from '../SocialIcons';

export type ProjectDemoKey =
  | 'project-vertex'
  | 'project-jarvis'
  | 'project-codsoft-portfolio'
  | 'project-netflix'
  | 'project-calculator';

interface ProjectDemoPanelProps {
  demoKey: ProjectDemoKey;
  liveUrl?: string;
  githubUrl?: string;
  lightTheme?: boolean;
  onActionClick?: () => void;
}

const VERTEX_FINISHES = [
  { name: 'Obsidian', body: '#181c26', accent: '#d6c7b2', glow: 'rgba(214,199,178,0.35)' },
  { name: 'Emerald', body: '#0d261e', accent: '#34d399', glow: 'rgba(52,211,153,0.4)' },
  { name: 'Sapphire', body: '#0c1f35', accent: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
  { name: 'Titanium', body: '#e5e2dc', accent: '#1e2028', glow: 'rgba(255,255,255,0.45)' },
];

const JARVIS_RESPONSES: Record<string, string> = {
  telemetry: 'CPU 14% • GPU WebGL 60 FPS • Memory Optimal • All systems green.',
  weather: 'Vadodara, Gujarat: 29°C Clear Sky • Humidity 42% • Breeze 9 km/h.',
  github: 'Fetching Shashank Jha repositories → 5 featured builds indexed (Vertex X1, J.A.R.V.I.S, Museum 3D).',
  fact: 'Fact: Three.js ACESFilmic tone mapping + PMREM IBL delivers film-grade PBR reflections right in the browser.',
};

const NETFLIX_TITLES = [
  { title: 'VERTEX X1: THE BUILD', tag: '3D Original • 4K HDR', genre: 'Engineering', color: '#0f766e' },
  { title: 'J.A.R.V.I.S CORE', tag: 'AI Documentary • 2025', genre: 'AI & Python', color: '#1d4ed8' },
  { title: 'THE DIGITAL MUSEUM', tag: 'Interactive Spatial • 60FPS', genre: 'Creative 3D', color: '#7c3aed' },
];

export default function ProjectDemoPanel({
  demoKey,
  liveUrl,
  githubUrl,
  lightTheme = false,
  onActionClick,
}: ProjectDemoPanelProps) {
  // Vertex X1 Demo State
  const [finishIdx, setFinishIdx] = useState(1);
  const [phoneTilt, setPhoneTilt] = useState(18);

  // J.A.R.V.I.S Demo State
  const [jarvisLog, setJarvisLog] = useState<{ from: 'user' | 'ai'; text: string }[]>([
    { from: 'ai', text: 'J.A.R.V.I.S online. Select a quick voice command or type below.' },
  ]);
  const [jarvisInput, setJarvisInput] = useState('');

  // Calculator Demo State
  const [calcExpr, setCalcExpr] = useState('12*4+8');
  const [calcResult, setCalcResult] = useState('56');

  // Netflix Clone Demo State
  const [activeMovieIdx, setActiveMovieIdx] = useState(0);

  // Portfolio Responsive Breakpoint Demo State
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const runJarvisCommand = (cmd: string) => {
    const clean = cmd.trim();
    if (!clean) return;
    onActionClick?.();
    const low = clean.toLowerCase();
    let reply = `Executing "${clean}" via Python REST automation pipeline → Task completed in 140ms.`;
    if (low.includes('tele') || low.includes('status') || low.includes('sys')) reply = JARVIS_RESPONSES.telemetry;
    else if (low.includes('weather') || low.includes('temp')) reply = JARVIS_RESPONSES.weather;
    else if (low.includes('git') || low.includes('repo') || low.includes('project')) reply = JARVIS_RESPONSES.github;
    else if (low.includes('fact') || low.includes('3d')) reply = JARVIS_RESPONSES.fact;

    setJarvisLog((prev) => [...prev.slice(-3), { from: 'user', text: clean }, { from: 'ai', text: reply }]);
    setJarvisInput('');
  };

  const evaluateCalc = (expr: string) => {
    onActionClick?.();
    try {
      const safe = expr
        .replace(/π/g, String(Math.PI))
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)')
        .replace(/\^/g, '**');
      if (!/^[0-9+\-*/().,\sMathsqrtincoPI*]+$/.test(safe)) {
        setCalcResult('Err');
        return;
      }
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${safe});`)();
      if (typeof val === 'number' && Number.isFinite(val)) {
        setCalcResult(Number(val.toFixed(6)).toString());
      } else {
        setCalcResult('Err');
      }
    } catch {
      setCalcResult('Err');
    }
  };

  const handleCalcKey = (key: string) => {
    onActionClick?.();
    if (key === 'C') {
      setCalcExpr('');
      setCalcResult('0');
      return;
    }
    if (key === '=') {
      evaluateCalc(calcExpr || '0');
      return;
    }
    const next = calcExpr + key;
    setCalcExpr(next);
  };

  const surfaceCls = lightTheme
    ? 'bg-white border-stone-300/90 text-stone-900 shadow-sm'
    : 'bg-[#0b0d12] border-[#d6c7b2]/20 text-[#f5f0e8]';
  const headerCls = lightTheme
    ? 'bg-stone-100 border-stone-200 text-stone-700'
    : 'bg-[#141722] border-[#d6c7b2]/15 text-[#d6c7b2]';

  return (
    <div className="space-y-3.5">
      {/* LIVE INTERACTIVE PROJECT DEMO BOX */}
      <div className={`rounded-2xl border overflow-hidden ${surfaceCls}`}>
        <div className={`px-3.5 py-2 border-b flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase font-bold ${headerCls}`}>
          <span className="flex items-center gap-1.5">
            <Play className="w-3 h-3 fill-current" />
            <span>Interactive Live Demo</span>
          </span>
          <span className="flex items-center gap-1 text-[9px] text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="p-3.5">
          {/* 1. VERTEX PHONE X1 INTERACTIVE HARDWARE DEMO */}
          {demoKey === 'project-vertex' && (
            <div className="space-y-3">
              <div className="relative h-36 rounded-xl bg-gradient-to-br from-[#0c1018] via-[#131b26] to-[#0a0d14] border border-white/10 flex items-center justify-center overflow-hidden">
                <div
                  className="w-16 h-28 rounded-2xl border-2 flex flex-col items-center justify-between p-2 transition-all duration-300"
                  style={{
                    backgroundColor: VERTEX_FINISHES[finishIdx].body,
                    borderColor: VERTEX_FINISHES[finishIdx].accent,
                    boxShadow: `0 12px 32px ${VERTEX_FINISHES[finishIdx].glow}`,
                    transform: `perspective(420px) rotateY(${phoneTilt}deg) rotateX(6deg)`,
                  }}
                >
                  <div className="w-5 h-1 rounded-full bg-white/30" />
                  <div className="text-center">
                    <Smartphone className="w-4 h-4 mx-auto mb-1" style={{ color: VERTEX_FINISHES[finishIdx].accent }} />
                    <div
                      className="text-[7px] font-mono font-bold tracking-widest"
                      style={{ color: VERTEX_FINISHES[finishIdx].accent }}
                    >
                      VERTEX X1
                    </div>
                  </div>
                  <div className="text-[6px] font-mono opacity-60" style={{ color: VERTEX_FINISHES[finishIdx].accent }}>
                    60 FPS 3D
                  </div>
                </div>
                <span className="absolute bottom-2 right-2.5 text-[9px] font-mono text-[#d6c7b2]/80">
                  {VERTEX_FINISHES[finishIdx].name} • {phoneTilt}°
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {VERTEX_FINISHES.map((fin, idx) => (
                    <button
                      key={fin.name}
                      type="button"
                      onClick={() => {
                        onActionClick?.();
                        setFinishIdx(idx);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer border ${
                        finishIdx === idx
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold'
                          : lightTheme
                            ? 'bg-stone-100 border-stone-300 text-stone-600 hover:border-stone-500'
                            : 'bg-[#141720] border-white/10 text-[#d5cec2]/80 hover:border-[#d6c7b2]/50'
                      }`}
                    >
                      {fin.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono opacity-65 shrink-0">Rotate</span>
                <input
                  type="range"
                  min={-48}
                  max={48}
                  value={phoneTilt}
                  onChange={(e) => setPhoneTilt(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 2. J.A.R.V.I.S VOICE AUTOMATION CONSOLE DEMO */}
          {demoKey === 'project-jarvis' && (
            <div className="space-y-2.5">
              <div className="rounded-xl bg-[#070a10] border border-cyan-500/25 p-2.5 h-28 overflow-y-auto space-y-1.5 font-mono text-[10px]">
                {jarvisLog.map((item, i) => (
                  <div key={i} className={item.from === 'user' ? 'text-cyan-300' : 'text-emerald-300'}>
                    <span className="opacity-50 mr-1">{item.from === 'user' ? '>' : 'AI:'}</span>
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['System Telemetry', 'Weather Vadodara', 'GitHub Projects', '3D Fact'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => runJarvisCommand(preset)}
                    className={`px-2 py-1 rounded-md text-[9px] font-mono border cursor-pointer transition-colors ${
                      lightTheme
                        ? 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200'
                        : 'bg-[#141824] border-cyan-400/25 text-cyan-200 hover:border-cyan-400'
                    }`}
                  >
                    <Terminal className="w-2.5 h-2.5 inline mr-1" />
                    {preset}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runJarvisCommand(jarvisInput);
                }}
                className="flex gap-1.5"
              >
                <input
                  type="text"
                  value={jarvisInput}
                  onChange={(e) => setJarvisInput(e.target.value)}
                  placeholder="Type a voice command..."
                  className={`flex-1 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border focus:outline-none ${
                    lightTheme
                      ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-600'
                      : 'bg-[#121622] border-white/15 text-[#f5f0e8] focus:border-cyan-400'
                  }`}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold cursor-pointer hover:bg-cyan-400 flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}

          {/* 3. LIVE WORKING SCIENTIFIC CALCULATOR DEMO */}
          {demoKey === 'project-calculator' && (
            <div className="space-y-2">
              <div className="rounded-xl bg-[#090c12] border border-white/10 px-3 py-2 text-right font-mono">
                <div className="text-[10px] text-[#8e877c] truncate min-h-[14px]">{calcExpr || '0'}</div>
                <div className="text-lg font-bold text-emerald-300 flex items-center justify-between">
                  <Calculator className="w-3.5 h-3.5 text-[#d6c7b2]/60" />
                  <span>{calcResult}</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
                {['7', '8', '9', '/', 'C', '4', '5', '6', '*', 'sin(', '1', '2', '3', '-', '√(', '0', '.', ')', '+', '='].map(
                  (k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleCalcKey(k)}
                      className={`py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                        k === '='
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                          : k === 'C'
                            ? 'bg-rose-500/20 border-rose-400/40 text-rose-400'
                            : lightTheme
                              ? 'bg-stone-100 border-stone-300 text-stone-800 hover:bg-stone-200'
                              : 'bg-[#141720] border-white/10 text-[#f5f0e8] hover:border-[#d6c7b2]/50'
                      }`}
                    >
                      {k}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* 4. NETFLIX UI CLONE INTERACTIVE PREVIEW CAROUSEL */}
          {demoKey === 'project-netflix' && (
            <div className="space-y-2.5">
              <div
                className="rounded-xl p-3.5 border border-white/15 text-white transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${NETFLIX_TITLES[activeMovieIdx].color}, #0b0d14)`,
                }}
              >
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest opacity-85">
                  <span className="flex items-center gap-1">
                    <Tv className="w-3 h-3 text-rose-400" />
                    STREAMING HUB PREVIEW
                  </span>
                  <span>{NETFLIX_TITLES[activeMovieIdx].genre}</span>
                </div>
                <div className="font-serif text-lg mt-1 font-medium">{NETFLIX_TITLES[activeMovieIdx].title}</div>
                <div className="text-[10px] font-mono opacity-80">{NETFLIX_TITLES[activeMovieIdx].tag}</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {NETFLIX_TITLES.map((item, idx) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      onActionClick?.();
                      setActiveMovieIdx(idx);
                    }}
                    className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                      activeMovieIdx === idx
                        ? 'border-rose-400 bg-rose-500/15'
                        : lightTheme
                          ? 'border-stone-200 bg-stone-50 hover:border-stone-400'
                          : 'border-white/10 bg-[#141720] hover:border-white/30'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold truncate">{item.title}</div>
                    <div className="text-[8px] font-mono opacity-60">{item.genre}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. CODSOFT PORTFOLIO RESPONSIVE BREAKPOINT DEMO */}
          {demoKey === 'project-codsoft-portfolio' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-center gap-1.5">
                {(
                  [
                    { id: 'desktop', label: 'Desktop', icon: Monitor },
                    { id: 'tablet', label: 'Tablet', icon: Tablet },
                    { id: 'mobile', label: 'Mobile', icon: Smartphone },
                  ] as const
                ).map((vp) => {
                  const Icon = vp.icon;
                  return (
                    <button
                      key={vp.id}
                      type="button"
                      onClick={() => {
                        onActionClick?.();
                        setViewportMode(vp.id);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono border flex items-center gap-1 cursor-pointer transition-all ${
                        viewportMode === vp.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold'
                          : lightTheme
                            ? 'bg-stone-100 border-stone-300 text-stone-700'
                            : 'bg-[#141720] border-white/10 text-[#d5cec2]'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{vp.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center">
                <div
                  className={`rounded-xl bg-[#0e1118] border border-[#d6c7b2]/25 p-3 text-[#f5f0e8] transition-all duration-300 ${
                    viewportMode === 'desktop' ? 'w-full' : viewportMode === 'tablet' ? 'w-4/5' : 'w-44'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                    <span className="text-[9px] font-mono text-[#d6c7b2] font-bold">SHASHANK.DEV</span>
                    <Sparkles className="w-3 h-3 text-[#d6c7b2]" />
                  </div>
                  <div className={`grid gap-1.5 ${viewportMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    <div className="p-1.5 rounded bg-white/5 text-[8px] font-mono">Projects</div>
                    <div className="p-1.5 rounded bg-white/5 text-[8px] font-mono">Skills</div>
                    <div className="p-1.5 rounded bg-white/5 text-[8px] font-mono">Contact</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIRECT LIVE LINK & GITHUB REPOSITORY BAR */}
      <div className="grid grid-cols-2 gap-2">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onActionClick?.()}
            className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:brightness-105 transition-all shadow-md"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onActionClick?.()}
            className={`py-2.5 px-3.5 rounded-xl border font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              lightTheme
                ? 'bg-stone-900 border-stone-900 text-white hover:bg-stone-800'
                : 'bg-[#141720] border-[#d6c7b2]/35 text-[#f5f0e8] hover:border-[#d6c7b2]'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repo</span>
          </a>
        )}
      </div>
      {demoKey === 'project-calculator' && (
        <button
          type="button"
          onClick={() => {
            setCalcExpr('12*4+8');
            setCalcResult('56');
          }}
          className="w-full py-1 text-[9px] font-mono opacity-60 hover:opacity-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" /> Reset sample equation
        </button>
      )}
    </div>
  );
}

