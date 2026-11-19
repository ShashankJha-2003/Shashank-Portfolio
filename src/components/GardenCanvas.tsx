'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Film } from 'lucide-react';
import MuseumExterior3D from './museum/three/MuseumExterior3D';
import { withBasePath } from '../lib/assetPath';

interface GoldenMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  life: number;
  maxLife: number;
  warm: boolean;
}

interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

function MuseumExteriorVideoStage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enteringPortal, setEnteringPortal] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultPlaybackRate = 1.0;
      video.playbackRate = 1.0;
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onEnterPortal = () => setEnteringPortal(true);
    window.addEventListener('museum-enter-flythrough', onEnterPortal);
    return () => window.removeEventListener('museum-enter-flythrough', onEnterPortal);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      normX: 0,
      normY: 0,
      smoothNormX: 0,
      smoothNormY: 0,
    };

    let dragPanOffset = 0;
    let isDragging = false;
    let dragStartX = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.normX = (e.clientX / Math.max(1, width) - 0.5) * 2;
      mouse.normY = (e.clientY / Math.max(1, height) - 0.5) * 2;
      if (isDragging) {
        const dx = e.clientX - dragStartX;
        dragStartX = e.clientX;
        dragPanOffset = Math.max(-28, Math.min(28, dragPanOffset + dx * 0.12));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const ripples: RippleWave[] = [];
    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: Math.min(width, height) * 0.24,
        alpha: 0.65,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);

    const motes: GoldenMote[] = [];
    const spawnMote = (customY?: number): GoldenMote => ({
      x: width * (0.12 + Math.random() * 0.76),
      y: customY !== undefined ? customY : height * (0.18 + Math.random() * 0.78),
      vx: (Math.random() - 0.5) * 0.28,
      vy: -Math.random() * 0.42 - 0.12,
      size: Math.random() * 2.1 + 0.7,
      baseAlpha: Math.random() * 0.42 + 0.16,
      pulseSpeed: Math.random() * 0.035 + 0.014,
      pulsePhase: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: Math.random() * 340 + 200,
      warm: Math.random() > 0.22,
    });
    for (let i = 0; i < 42; i++) motes.push(spawnMote());

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      mouse.smoothNormX += (mouse.normX - mouse.smoothNormX) * 0.055;
      mouse.smoothNormY += (mouse.normY - mouse.smoothNormY) * 0.055;
      if (!isDragging) dragPanOffset *= 0.96;

      if (stageRef.current) {
        const tx = -mouse.smoothNormX * 16 + dragPanOffset;
        const ty = -mouse.smoothNormY * 9;
        const ry = mouse.smoothNormX * 1.4;
        const rx = -mouse.smoothNormY * 0.9;
        stageRef.current.style.transform = `perspective(1400px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.05)`;
      }

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.life++;
        m.y += m.vy;
        m.x += m.vx + Math.sin(time * 0.9 + m.pulsePhase) * 0.2;
        if (m.y < height * 0.08 || m.life > m.maxLife) {
          motes[i] = spawnMote(height * (0.78 + Math.random() * 0.18));
          continue;
        }
        const alpha = Math.max(0, Math.min(0.85, m.baseAlpha + Math.sin(time * m.pulseSpeed * 22 + m.pulsePhase) * 0.2));
        ctx.fillStyle = m.warm ? '#f7ddb0' : '#dbeafe';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rw = ripples[i];
        rw.radius += 3.6;
        rw.alpha *= 0.945;
        if (rw.alpha <= 0.01 || rw.radius >= rw.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(214, 199, 178, ${rw.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(rw.x, rw.y, rw.radius, rw.radius * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#060911] flex items-center justify-center select-none pointer-events-none">
      <div
        className={`w-full h-full transition-all duration-[1050ms] ease-in ${
          enteringPortal ? 'scale-[2.05] brightness-[1.45]' : 'scale-100 brightness-100'
        }`}
        style={{ transformOrigin: '50% 45%' }}
      >
        <div ref={stageRef} className="w-full h-full will-change-transform transform-gpu" style={{ transform: 'scale(1.05)' }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={withBasePath('/museum_exterior_poster.jpg')}
            className="w-full h-full object-cover object-center filter contrast-[1.04] saturate-[1.08]"
          >
            <source src={withBasePath('/museum_exterior_intro.mp4')} type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_48%,_rgba(5,8,15,0.48)_82%,_rgba(4,6,11,0.88)_100%)] pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#060911]/85 via-[#060911]/40 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#060911]/90 via-[#060911]/48 to-transparent pointer-events-none z-20" />
      <div
        className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-[950ms] ease-in bg-[radial-gradient(circle_at_50%_45%,rgba(255,236,196,0.95)_0%,rgba(214,199,178,0.72)_45%,rgba(15,16,19,0.96)_100%)] ${
          enteringPortal ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default function GardenCanvas() {
  const [exteriorMode, setExteriorMode] = useState<'3d' | 'video'>('3d');

  return (
    <>
      {exteriorMode === '3d' ? <MuseumExterior3D /> : <MuseumExteriorVideoStage />}

      {/* Discreet Corner Architectural Framing Marks */}
      <div className="fixed inset-5 sm:inset-9 pointer-events-none z-20 flex flex-col justify-between select-none opacity-65">
        <div className="flex justify-between items-start">
          <div className="hidden lg:flex flex-col gap-0.5 border-t border-l border-[#d6c7b2]/35 pt-2 pl-2.5 mt-12">
            <span className="font-mono text-[9px] tracking-[0.24em] text-[#d6c7b2] uppercase">
              THE DIGITAL MUSEUM // EST. 2026
            </span>
            <span className="font-mono text-[8px] tracking-[0.18em] text-[#d5cec2]/60 uppercase">
              {exteriorMode === '3d' ? 'INTERACTIVE THREE.JS 3D ARCHITECTURE' : 'CINEMATIC TWILIGHT FACADE VIDEO'}
            </span>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-0.5 border-t border-r border-[#d6c7b2]/35 pt-2 pr-2.5 mt-12">
            <span className="font-mono text-[9px] tracking-[0.24em] text-[#d6c7b2] uppercase">
              10 GALLERIES • 9 TURNS
            </span>
            <span className="font-mono text-[8px] tracking-[0.18em] text-[#d5cec2]/60 uppercase">
              DOORS ILLUMINATED • OPEN
            </span>
          </div>
        </div>
      </div>

      {/* Sleek Mode Switcher Pill: Switch Live Between Real Interactive 3D Building & Cinema Video */}
      <div className="fixed bottom-6 left-5 sm:left-8 z-40 pointer-events-auto flex items-center p-1 rounded-full bg-[#090c14]/80 backdrop-blur-xl border border-[#d6c7b2]/30 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
        <button
          type="button"
          onClick={() => setExteriorMode('3d')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer ${
            exteriorMode === '3d'
              ? 'bg-[#d6c7b2] text-[#0c0e13]'
              : 'text-[#d5cec2]/75 hover:text-[#f5f0e8]'
          }`}
        >
          <Box className="w-3 h-3" />
          <span>3D Model</span>
        </button>
        <button
          type="button"
          onClick={() => setExteriorMode('video')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer ${
            exteriorMode === 'video'
              ? 'bg-[#d6c7b2] text-[#0c0e13]'
              : 'text-[#d5cec2]/75 hover:text-[#f5f0e8]'
          }`}
        >
          <Film className="w-3 h-3" />
          <span>Video</span>
        </button>
      </div>
    </>
  );
}
