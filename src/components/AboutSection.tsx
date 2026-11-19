'use client';

import React from 'react';
import { Terminal, Cpu, Zap, Compass, Code2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AboutSection() {
  const { data, playAudioCue } = usePortfolio();

  const pillars = [
    {
      icon: Zap,
      title: 'Performance-First Engineering',
      description: 'Prioritizing sub-second initial loads, zero frame drops on complex WebGL viewports, and edge-rendered Next.js Server Components.'
    },
    {
      icon: Cpu,
      title: 'Tactile 3D & Creative Motion',
      description: 'Transforming static web layouts into living spatial interfaces through Three.js shaders, GSAP micro-timelines, and sensory feedback.'
    },
    {
      icon: ShieldCheck,
      title: 'Resilient Cloud & Systems',
      description: 'Architecting scalable backend infrastructure with PostgreSQL, Docker, Redis, and strict TypeScript types that withstand high traffic spikes.'
    }
  ];

  return (
    <section id="about" className="relative py-28 px-4 sm:px-8 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f5d4] uppercase mb-2">
            <span>[ 01 // OVERVIEW ]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineering with <span className="gradient-text-vibrant">Artistic Precision</span>
          </h2>
        </div>

        {/* Two-column layout: Story / Bio & Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Bio text column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-white/80 leading-relaxed text-base sm:text-lg font-light">
            {data.personal.bioParagraphs.map((paragraph, index) => (
              <p key={index} className="text-justify sm:text-left">
                {paragraph}
              </p>
            ))}

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-white/60">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <Compass className="w-3.5 h-3.5 text-[#00f5d4]" />
                <span>Base: {data.personal.location}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Mentorship & Code Reviews</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <Code2 className="w-3.5 h-3.5 text-[#9d4edd]" />
                <span>Clean Architecture Advocate</span>
              </div>
            </div>
          </div>

          {/* Interactive Terminal / Code Snippet Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-white/40 ml-2">developer.config.ts</span>
                </div>
                <Terminal className="w-4 h-4 text-white/30" />
              </div>

              <div className="font-mono text-xs text-white/70 space-y-2 leading-relaxed">
                <div>
                  <span className="text-[#9d4edd]">const</span> <span className="text-[#38bdf8]">developer</span> = &#123;
                </div>
                <div className="pl-4">
                  <span className="text-white/60">name:</span> <span className="text-[#00f5d4]">&quot;{data.personal.name}&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-white/60">coreTechnologies:</span> [
                </div>
                <div className="pl-8 text-[#00f5d4]/90">
                  &quot;JavaScript&quot;, &quot;React&quot;, &quot;Three.js&quot;, &quot;GSAP&quot;, &quot;Java &amp; DSA&quot;, &quot;Node.js&quot;, &quot;Python&quot;
                </div>
                <div className="pl-4">],</div>
                <div className="pl-4">
                  <span className="text-white/60">focus:</span> <span className="text-[#38bdf8]">&quot;Interactive 3D Web &amp; Responsive Frontend Systems&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-white/60">education:</span> <span className="text-emerald-400">&quot;Parul University (B.Tech CSE)&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-white/60">experience:</span> <span className="text-purple-400">&quot;PRISMIO (React Trainee) &amp; CodSoft&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-white/60">coffeeConsumed:</span> <span className="text-amber-300">Infinity</span>
                </div>
                <div>&#125;;</div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>// RUNTIME: READY</span>
                <span className="text-[#00f5d4] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-ping" />
                  ALL TESTS PASSING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => playAudioCue('hover')}
                className="glass-card p-7 rounded-2xl border border-white/[0.06] hover:border-[#00f5d4]/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#00f5d4]/10 group-hover:border-[#00f5d4]/30 transition-all duration-300">
                  <Icon className="w-6 h-6 text-[#00f5d4]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00f5d4] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
