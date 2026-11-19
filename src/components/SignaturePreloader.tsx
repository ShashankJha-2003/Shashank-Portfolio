'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePortfolio } from '../context/PortfolioContext';

export default function SignaturePreloader() {
  const { data, isPreloaderFinished, setPreloaderFinished, playAudioCue } = usePortfolio();

  // Sequence phases: 'flipbook' -> 'logoImpact'
  const [phase, setPhase] = useState<'flipbook' | 'logoImpact'>('flipbook');
  const [activePanelIndex, setActivePanelIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const marvelBoxRef = useRef<HTMLDivElement>(null);
  const letterMaskRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const subtitleBarRef = useRef<HTMLDivElement>(null);

  // Comic & Code Flipbook Panels (Marvel comic strip pages inspired by developer stack)
  const comicPanels = [
    {
      title: 'REACT 19 & NEXT.JS',
      code: 'const App = () => <NextUniverse />',
      badge: 'EPISODE 01',
      accent: '#00f5d4',
      type: 'TECH REEL'
    },
    {
      title: 'THREE.JS & SHADERS',
      code: 'gl_FragColor = vec4(neonColor, 1.0);',
      badge: 'GRAPHICS',
      accent: '#9d4edd',
      type: 'WEBGL CORE'
    },
    {
      title: 'GSAP KINETIC MOTION',
      code: 'gsap.timeline({ ease: "power4.out" })',
      badge: 'CHOREOGRAPHY',
      accent: '#38bdf8',
      type: 'FLUID MOTION'
    },
    {
      title: 'SYSTEM ARCHITECTURE',
      code: 'SELECT * FROM production_clusters;',
      badge: 'DISTRIBUTED',
      accent: '#f59e0b',
      type: 'BACKEND'
    },
    {
      title: '3D SPATIAL CANVAS',
      code: 'renderer.render(scene, perspectiveCam);',
      badge: 'DIMENSIONS',
      accent: '#ec4899',
      type: 'CREATIVE'
    },
    {
      title: 'PERFORMANCE SCORE',
      code: 'LighthouseScore: 100 // Sub-50ms TTL',
      badge: 'LIGHTHOUSE',
      accent: '#10b981',
      type: 'OPTIMIZATION'
    }
  ];

  useEffect(() => {
    if (isPreloaderFinished) return;

    // Reset phase when reopened
    setPhase('flipbook');

    // 1. Rapid comic-panel flipping loop
    let flipInterval: NodeJS.Timeout;
    let flipCount = 0;
    const maxFlips = 26;

    flipInterval = setInterval(() => {
      setActivePanelIndex((prev) => (prev + 1) % comicPanels.length);
      flipCount++;

      // Play soft mechanical page-flip audio ticks
      if (flipCount % 3 === 0) {
        playAudioCue('pageFlip');
      }

      // Transition to Marvel Logo Impact
      if (flipCount >= maxFlips) {
        clearInterval(flipInterval);
        triggerMarvelLogoImpact();
      }
    }, 65);

    // Initial camera zoom inside the letters
    if (letterMaskRef.current) {
      gsap.fromTo(
        letterMaskRef.current,
        { scale: 2.8, filter: 'blur(6px)', opacity: 0.8 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.6, ease: 'power2.inOut' }
      );
    }

    return () => {
      clearInterval(flipInterval);
    };
  }, [isPreloaderFinished]);

  // Phase 2: Marvel Logo Impact & Thundering Fanfare
  const triggerMarvelLogoImpact = () => {
    setPhase('logoImpact');
    playAudioCue('marvelFanfare');

    const tl = gsap.timeline();

    // Red Box slam / dramatic camera pull back
    if (marvelBoxRef.current) {
      tl.fromTo(
        marvelBoxRef.current,
        { scale: 1.5, opacity: 0, rotationX: 12 },
        { scale: 1, opacity: 1, rotationX: 0, duration: 0.55, ease: 'back.out(2)' }
      );
    }

    // Subtitle bar slide down
    if (subtitleBarRef.current) {
      tl.fromTo(
        subtitleBarRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
        '-=0.15'
      );
    }

    // Specular light sweep across Marvel logo
    if (flareRef.current) {
      tl.fromTo(
        flareRef.current,
        { xPercent: -150, opacity: 0 },
        { xPercent: 260, opacity: 0.95, duration: 0.75, ease: 'power2.inOut' },
        '-=0.2'
      );
    }

    // Hold on the majestic Marvel logo then transition into main page
    tl.to({}, { duration: 1.2 });
    tl.add(() => {
      handleEnter();
    });
  };

  // Exit: Split-Curtain Flash & Unveil Main Page
  const handleEnter = () => {
    if (!containerRef.current) return;
    playAudioCue('whoosh');

    const exitTl = gsap.timeline({
      onComplete: () => {
        setPreloaderFinished(true);
      }
    });

    exitTl
      .to(marvelBoxRef.current, {
        scale: 1.08,
        opacity: 0,
        filter: 'brightness(2.2)',
        duration: 0.45,
        ease: 'power2.in'
      })
      .to(topCurtainRef.current, {
        yPercent: -100,
        duration: 0.85,
        ease: 'power4.inOut'
      }, '-=0.15')
      .to(bottomCurtainRef.current, {
        yPercent: 100,
        duration: 0.85,
        ease: 'power4.inOut'
      }, '<')
      .to(containerRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.2
      });
  };

  if (isPreloaderFinished) return null;

  const currentPanel = comicPanels[activePanelIndex];
  const nameFirst = data.personal.name.split(' ')[0] || 'ALEX';
  const nameLast = data.personal.name.split(' ').slice(1).join(' ') || 'VANCE';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Top Split Shutter */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#05060b] border-b border-red-900/40 z-10"
      />

      {/* Bottom Split Shutter */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#05060b] border-t border-red-900/40 z-10"
      />

      {/* Cinematic Film Vignette */}
      <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.9)_100%)]" />

      {/* Center Cinematic Stage */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl">
        {/* ============================================================== */}
        {/* STAGE 1: Marvel Rapid Flipbook Panels with 3D Stencil Name */}
        {/* ============================================================== */}
        {phase === 'flipbook' && (
          <div
            ref={letterMaskRef}
            className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-150"
          >
            {/* The Rapid-Flipping Panel Container */}
            <div className="relative w-80 sm:w-96 md:w-[500px] h-52 sm:h-60 rounded-xl overflow-hidden border-2 border-red-600/70 shadow-[0_0_60px_rgba(226,54,54,0.5)] bg-[#0d0910]">
              {/* Halftone / Comic Strip texture overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '8px 8px'
                }}
              />

              {/* Panel Content (simulating flipping comic frames & code architecture) */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-left">
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-mono tracking-widest text-white/90 font-bold">
                      {currentPanel.type}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600 text-white font-extrabold uppercase tracking-wider">
                    {currentPanel.badge}
                  </span>
                </div>

                <div className="my-auto">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">
                    {currentPanel.title}
                  </h3>
                  <p className="font-mono text-xs sm:text-sm text-[#00f5d4] mt-2 bg-black/60 p-2 rounded border border-white/10">
                    {currentPanel.code}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-2 border-t border-white/10">
                  <span>MARVEL STYLE PORTFOLIO LOADING</span>
                  <span className="text-red-400">FRAME #{activePanelIndex + 1}/6</span>
                </div>
              </div>

              {/* Red comic color filter sweep */}
              <div className="absolute inset-0 bg-red-600/10 mix-blend-color-dodge pointer-events-none" />
            </div>

            {/* Giant Stencil Name in background */}
            <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase text-white/90 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              {data.personal.name}
            </div>
            <p className="text-xs font-mono tracking-[0.3em] text-red-500 uppercase animate-pulse">
              INITIALIZING EXPERIENCE
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 2: Iconic Marvel Crimson Red Box Slam & Specular Flare */}
        {/* ============================================================== */}
        {phase === 'logoImpact' && (
          <div
            ref={marvelBoxRef}
            className="flex flex-col items-center justify-center relative max-w-2xl w-full"
          >
            {/* Ambient Red Glow */}
            <div className="absolute -inset-10 bg-red-600/35 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* The Classic Marvel Crimson Box */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#e23636] to-[#b31414] px-8 sm:px-14 py-4 sm:py-6 border-2 border-white/95 shadow-[0_0_70px_rgba(226,54,54,0.9),inset_0_0_20px_rgba(0,0,0,0.5)] transform -skew-x-2">
              {/* Specular Light Sweep Streak */}
              <div
                ref={flareRef}
                className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 pointer-events-none opacity-85"
              />

              {/* Bold Condensed Marvel Typography */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-[2px_3px_0px_rgba(0,0,0,0.8)] leading-none select-none">
                  {nameFirst}
                </span>
                <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-[2px_3px_0px_rgba(0,0,0,0.8)] leading-none select-none">
                  {nameLast}
                </span>
              </div>
            </div>

            {/* Bottom Metallic Studios Subtitle Bar */}
            <div
              ref={subtitleBarRef}
              className="mt-3.5 px-6 py-1.5 bg-black/95 border border-white/20 rounded-sm shadow-xl flex items-center justify-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.35em] text-white/95 uppercase font-mono">
                CREATIVE TECHNOLOGIST STUDIOS
              </span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Skip Intro Button */}
        <button
          onClick={handleEnter}
          className="mt-10 px-6 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 border border-red-500/40 bg-red-500/10 text-white/90 hover:bg-red-500/25 hover:border-red-400 cursor-pointer shadow-[0_0_20px_rgba(226,54,54,0.3)] flex items-center gap-2"
        >
          <span>SKIP INTRO</span>
          <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
