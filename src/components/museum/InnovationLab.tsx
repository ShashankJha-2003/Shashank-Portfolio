'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FlaskConical, Sparkles, BookOpen, X, Clock, Sliders, Magnet } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BlogPost } from '../../types/portfolio';
import MuseumRoomHeader from './MuseumRoomHeader';

/**
 * EXP-001: Interactive Magnetic Particle Physics Sandbox
 */
function ParticleLabExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'attract' | 'repel'>('attract');
  const modeRef = useRef<'attract' | 'repel'>('attract');

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth || 360);
    const h = (canvas.height = canvas.clientHeight || 220);

    const mouse = { x: w / 2, y: h / 2, active: false };
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      r: Math.random() * 2 + 1.2,
    }));

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * w;
      mouse.y = ((e.clientY - rect.top) / rect.height) * h;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let animId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(11, 13, 17, 0.35)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 130) {
            const dir = modeRef.current === 'attract' ? 1 : -1;
            const force = ((130 - dist) / 130) * 0.32 * dir;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Draw subtle constellation links
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 56) {
            ctx.strokeStyle =
              modeRef.current === 'attract'
                ? `rgba(214, 199, 178, ${(1 - d / 56) * 0.28})`
                : `rgba(56, 189, 248, ${(1 - d / 56) * 0.32})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = modeRef.current === 'attract' ? '#ece3d4' : '#7dd3fc';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="museum-plaque rounded-3xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#c4b5fd]">
            EXP-001 // PHYSICS
          </span>
          <h3 className="font-serif text-2xl text-[#f5f0e8]">Particle Field Sandbox</h3>
        </div>
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'attract' ? 'repel' : 'attract'))}
          className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-[#d6c7b2]/30 bg-[#0f1013] text-[#d6c7b2] hover:bg-[#d6c7b2] hover:text-[#0f1013] transition-colors cursor-pointer flex items-center gap-1"
        >
          <Magnet className="w-3 h-3" />
          <span>{mode}</span>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[200px] rounded-2xl bg-[#0b0d11] border border-[#d6c7b2]/15 cursor-crosshair"
      />

      <p className="text-xs text-[#d5cec2]/70 font-light mt-3.5 leading-relaxed">
        Move your pointer across the canvas to warp real-time constellation gravity vectors. Toggle Attract / Repel forces.
      </p>
    </div>
  );
}

/**
 * EXP-002: Procedural Architectural Wave Field
 */
function ProceduralWaveExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [energy, setEnergy] = useState<'calm' | 'resonance' | 'hyper'>('resonance');
  const energyRef = useRef<'calm' | 'resonance' | 'hyper'>('resonance');

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth || 360);
    const h = (canvas.height = canvas.clientHeight || 220);

    let t = 0;
    let animId: number;

    const render = () => {
      const speed = energyRef.current === 'calm' ? 0.015 : energyRef.current === 'resonance' ? 0.035 : 0.075;
      const amp = energyRef.current === 'calm' ? 14 : energyRef.current === 'resonance' ? 26 : 38;
      t += speed;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0b0d11';
      ctx.fillRect(0, 0, w, h);

      const lines = 7;
      for (let l = 0; l < lines; l++) {
        ctx.beginPath();
        const baseY = (h / (lines + 1)) * (l + 1);
        for (let x = 0; x <= w; x += 6) {
          const y =
            baseY +
            Math.sin(x * 0.018 + t + l * 0.55) * amp * 0.6 +
            Math.cos(x * 0.009 - t * 0.7 + l) * amp * 0.35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          l % 2 === 0
            ? `rgba(214, 199, 178, ${0.22 + (l / lines) * 0.45})`
            : `rgba(167, 139, 250, ${0.2 + (l / lines) * 0.45})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="museum-plaque rounded-3xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#c4b5fd]">
            EXP-002 // GENERATIVE
          </span>
          <h3 className="font-serif text-2xl text-[#f5f0e8]">Harmonic Wave Study</h3>
        </div>
        <div className="flex items-center gap-1">
          {(['calm', 'resonance', 'hyper'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setEnergy(lvl)}
              className={`px-2 py-1 rounded text-[9px] font-mono uppercase cursor-pointer transition-colors ${
                energy === lvl
                  ? 'bg-[#d6c7b2] text-[#0f1013] font-bold'
                  : 'bg-[#0f1013] text-[#d5cec2]/70 border border-[#d6c7b2]/15'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[200px] rounded-2xl bg-[#0b0d11] border border-[#d6c7b2]/15"
      />

      <p className="text-xs text-[#d5cec2]/70 font-light mt-3.5 leading-relaxed">
        Procedural multi-phase harmonic contour oscillator exploring mathematical beauty in real-time Canvas shaders.
      </p>
    </div>
  );
}

export default function InnovationLab() {
  const { data, playAudioCue } = usePortfolio();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const blogs = data.blogs || [];
  const hobbies = data.hobbies || [];

  return (
    <section
      id="innovation-lab"
      className="relative py-28 sm:py-36 px-4 sm:px-8 border-t border-[#d6c7b2]/10 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/35 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="05"
          wingLabel="INNOVATION LAB — WHERE IDEAS BECOME EXPERIMENTS"
          title="Beyond The"
          accentWord="Exhibitions"
          accentTone="violet"
          subtitle="A developer isn't defined only by finished products, but by curiosity and experimentation. Explore live prototypes, generative studies, technical notebooks, and personal passions."
        />

        {/* Interactive Lab Prototypes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <ParticleLabExperiment />
          <ProceduralWaveExperiment />
        </div>

        {/* Research Notebooks (Technical Articles & Engineering Discoveries) */}
        {blogs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-7">
              <BookOpen className="w-4 h-4 text-[#d6c7b2]" />
              <span className="text-xs font-mono tracking-[0.22em] uppercase text-[#d6c7b2] font-semibold">
                Lab Research Notebooks — Technical Writings
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#d6c7b2]/25 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {blogs.map((post, idx) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => {
                    playAudioCue('click');
                    setActivePost(post);
                  }}
                  onMouseEnter={() => playAudioCue('hover')}
                  className="text-left museum-plaque rounded-2xl p-6 hover:border-[#d6c7b2]/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8e877c] mb-2.5">
                      <span className="text-[#d6c7b2]">
                        NOTEBOOK 0{idx + 1} // {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h4 className="font-serif text-2xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors leading-snug mb-2">
                      {post.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#d5cec2]/75 font-light leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#d6c7b2]/10">
                    <span className="text-[10px] font-mono text-[#8e877c]">{post.date}</span>
                    <span className="text-[11px] font-mono text-[#d6c7b2] uppercase tracking-wider">
                      Read Entry →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Curator's Curiosities & Passions Shelf */}
        {hobbies.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-7">
              <FlaskConical className="w-4 h-4 text-[#d6c7b2]" />
              <span className="text-xs font-mono tracking-[0.22em] uppercase text-[#d6c7b2] font-semibold">
                Curator&apos;s Curiosities &amp; Passions
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#d6c7b2]/25 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hobbies.map((hobby) => (
                <div
                  key={hobby.id}
                  className="p-5 rounded-2xl bg-[#13151c]/90 border border-[#d6c7b2]/12 hover:border-[#d6c7b2]/35 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{hobby.icon}</span>
                    <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#0f1013] border border-[#d6c7b2]/20 text-[#d6c7b2]">
                      {hobby.badge}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#f5f0e8] mb-1.5">{hobby.title}</h4>
                  <p className="text-xs text-[#d5cec2]/75 font-light leading-relaxed">
                    {hobby.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Research Notebook Reader Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg"
          onClick={() => setActivePost(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[84vh] overflow-y-auto rounded-3xl museum-plaque p-7 sm:p-10"
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#d6c7b2]/15">
              <div>
                <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#d6c7b2]">
                  {activePost.category} • {activePost.date} • {activePost.readTime}
                </span>
                <h3 className="font-serif text-3xl text-[#f5f0e8] mt-1.5 leading-tight">
                  {activePost.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="p-2 rounded-full bg-[#0f1013] border border-[#d6c7b2]/25 text-[#d5cec2] hover:text-white cursor-pointer"
                aria-label="Close article"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-[#d5cec2]/90 font-light leading-relaxed">
              {activePost.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#d6c7b2]/15 flex flex-wrap gap-2">
              {activePost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0f1013] border border-[#d6c7b2]/20 text-[#d6c7b2]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

