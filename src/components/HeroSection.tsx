'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, Sparkles, Download, Layers, MoveHorizontal, RotateCcw } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { withBasePath } from '../lib/assetPath';

export default function HeroSection() {
  const { data, isPreloaderFinished, playAudioCue, setResumeModalOpen } = usePortfolio();
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const modelCenterRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const techPillsRef = useRef<HTMLDivElement>(null);
  const faceVideoRef = useRef<HTMLVideoElement>(null);

  const targetTimeRef = useRef<number>(0.02);
  const currentTimeRef = useRef<number>(0.02);
  const velocityRef = useRef<number>(0);
  const isDraggingFaceRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);

  const [isDraggingUi, setIsDraggingUi] = useState(false);
  const [angleDeg, setAngleDeg] = useState(0);

  const resetFrontAngle = () => {
    playAudioCue('click');
    const dur = faceVideoRef.current?.duration || 10.03;
    const cycles = Math.round(currentTimeRef.current / dur);
    velocityRef.current = 0;
    targetTimeRef.current = cycles * dur + 0.02;
  };

  // Manual mouse-drag 360° rotation with silky bearing momentum (paused by default — rotates ONLY on drag)
  useEffect(() => {
    const video = faceVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.pause();

    const initVideoFrame = () => {
      video.pause();
      video.currentTime = 0.02;
      targetTimeRef.current = 0.02;
      currentTimeRef.current = 0.02;
      velocityRef.current = 0;
    };

    if (video.readyState >= 1) {
      initVideoFrame();
    } else {
      video.addEventListener('loadedmetadata', initVideoFrame);
      video.addEventListener('canplay', initVideoFrame, { once: true });
    }

    let animId: number;
    let lastDeg = 0;
    const updateRotation = () => {
      if (video && video.duration) {
        const dur = video.duration;
        if (!isDraggingFaceRef.current && Math.abs(velocityRef.current) > 0.0004) {
          targetTimeRef.current += velocityRef.current;
          velocityRef.current *= 0.88;
        } else if (!isDraggingFaceRef.current) {
          velocityRef.current = 0;
        }
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.0012) {
          currentTimeRef.current += diff * 0.2;
          if (!video.seeking) {
            let wrapped = currentTimeRef.current % dur;
            if (wrapped < 0) wrapped += dur;
            video.currentTime = Math.max(0.01, Math.min(dur - 0.02, wrapped));
          }
          const norm = (((currentTimeRef.current / dur) % 1) + 1) % 1;
          const deg = Math.round(norm * 360) % 360;
          if (deg !== lastDeg) {
            lastDeg = deg;
            setAngleDeg(deg);
          }
        }
      }
      animId = requestAnimationFrame(updateRotation);
    };

    animId = requestAnimationFrame(updateRotation);

    return () => {
      video.removeEventListener('loadedmetadata', initVideoFrame);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Drag-only rotation handlers (no hover tilt or unwanted motion)
  const handleFacePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingFaceRef.current = true;
    velocityRef.current = 0;
    setIsDraggingUi(true);
    dragStartXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleFacePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingFaceRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragStartXRef.current = e.clientX;
    const dur = faceVideoRef.current?.duration || 10.03;
    const step = (deltaX / 340) * dur;
    targetTimeRef.current += step;
    velocityRef.current = step * 0.72;
  };

  const handleFacePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingFaceRef.current) return;
    isDraggingFaceRef.current = false;
    setIsDraggingUi(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // GSAP Entrance Animation
  useEffect(() => {
    if (!isPreloaderFinished) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, { y: -24, opacity: 0, duration: 0.7, delay: 0.05 })
        .from(titleRef.current, { y: 30, opacity: 0, duration: 0.85 }, '-=0.45')
        .from(modelCenterRef.current, { scale: 0.94, opacity: 0, duration: 0.95 }, '-=0.55')
        .from(descRef.current, { y: 20, opacity: 0, duration: 0.7 }, '-=0.55')
        .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.65 }, '-=0.45')
        .from(techPillsRef.current, { opacity: 0, y: 12, duration: 0.55 }, '-=0.35')
        .from(
          statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { y: 24, opacity: 0, stagger: 0.08, duration: 0.65 },
          '-=0.35'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [isPreloaderFinished]);

  const techBadges = [
    'Next.js 16',
    'React 19',
    'Three.js',
    'GSAP 3',
    'WebGL Shaders',
    'TypeScript',
    'Tailwind CSS',
  ];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 pt-24 pb-20 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full z-10 flex flex-col items-center text-center">
        {/* Museum Room 00 Entrance Plaque */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#d6c7b2]/30 bg-[#16181f]/90 backdrop-blur-md mb-4 hover:border-[#d6c7b2]/60 transition-all duration-300 shadow-[0_0_20px_rgba(214,199,178,0.12)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d6c7b2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d6c7b2]"></span>
          </span>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#d6c7b2] font-semibold">
            ROOM 00 // ENTRANCE HALL • FOUNDED BY {data.personal.name}
          </span>
        </div>

        {/* Monumental Museum Display Title */}
        <h1
          ref={titleRef}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02] mb-2 text-[#f5f0e8]"
        >
          THE DIGITAL{' '}
          <span className="italic font-normal bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">
            MUSEUM
          </span>
          <span className="block font-sans text-sm sm:text-base lg:text-lg font-light tracking-wide text-[#d6c7b2]/85 mt-2">
            An Exhibition of Ideas, Experiments &amp; Creations.
          </span>
        </h1>

        {/* CENTERPIECE: Enlarged Studio-Enhanced Borderless 3D Face Model (Centered & 360° Drag-to-Rotate) */}
        <div ref={modelCenterRef} className="relative flex flex-col items-center justify-center my-1 sm:my-2">
          {/* Subtle Warm Gallery Spotlight Halo & Floor Turntable Aura */}
          <div className="pointer-events-none absolute w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full bg-[#d6c7b2]/[0.08] blur-[110px]" />
          <div className="pointer-events-none absolute bottom-6 w-[280px] sm:w-[390px] h-14 rounded-full border border-[#d6c7b2]/30 bg-gradient-to-r from-transparent via-[#d6c7b2]/15 to-transparent blur-[2px] shadow-[0_0_45px_rgba(214,199,178,0.25)]" />

          <div
            onPointerDown={handleFacePointerDown}
            onPointerMove={handleFacePointerMove}
            onPointerUp={handleFacePointerUp}
            onPointerCancel={handleFacePointerUp}
            className="relative flex items-center justify-center pointer-events-auto select-none touch-pan-y cursor-grab active:cursor-grabbing"
          >
            <div
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 11%, black 89%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 85%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 11%, black 89%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 85%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
              className="relative h-[68vh] sm:h-[76vh] lg:h-[82vh] max-h-[840px] w-auto aspect-[9/16] flex items-center justify-center overflow-hidden"
            >
              <video
                ref={faceVideoRef}
                muted
                playsInline
                preload="auto"
                poster={withBasePath('/face_3d_poster.jpg?v=5')}
                className="w-full h-full object-cover object-[center_14%] select-none pointer-events-none scale-[1.12] contrast-[1.06] saturate-[1.05] brightness-[1.04]"
              >
                <source src={withBasePath('/3d_model_me.mp4?v=5')} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Interactive 360° Drag Pill + One-Click Reset */}
          <div
            className={`-mt-6 z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-200 shadow-[0_10px_35px_rgba(0,0,0,0.8)] ${
              isDraggingUi
                ? 'bg-[#1a1d26]/95 border-[#d6c7b2]/75 scale-105'
                : 'bg-[#12141b]/88 border-[#d6c7b2]/35'
            }`}
          >
            <MoveHorizontal className="w-3.5 h-3.5 text-[#d6c7b2]" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-[#f5f0e8]">
              {isDraggingUi ? 'Rotating 3D Model' : 'Drag 3D Model to Rotate 360°'}
            </span>
            <span className="text-[#d6c7b2]/35">|</span>
            <span className="text-[11px] font-mono font-bold text-[#d6c7b2] tabular-nums w-9 text-right">
              {angleDeg}°
            </span>
            {angleDeg !== 0 && (
              <button
                type="button"
                onClick={resetFrontAngle}
                className="ml-0.5 p-1 rounded-full bg-[#d6c7b2]/15 hover:bg-[#d6c7b2] text-[#d6c7b2] hover:text-[#0f1013] transition-colors cursor-pointer"
                title="Reset Front View (0°)"
                aria-label="Reset 3D model to front view"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Curator Welcome Note */}
        <p
          ref={descRef}
          className="text-sm sm:text-base text-[#d5cec2]/85 max-w-2xl mt-4 mb-7 leading-relaxed font-light"
        >
          Welcome to the curated archive of{' '}
          <span className="font-semibold text-[#f5f0e8]">{data.personal.name}</span>.{' '}
          {data.personal.tagline}
        </p>

        {/* Museum Entrance Actions */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mb-7">
          <a
            href="#introduction"
            onClick={(e) => {
              e.preventDefault();
              playAudioCue('click');
              document.querySelector('#introduction')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => playAudioCue('hover')}
            className="group relative px-7 py-3.5 rounded-full bg-gradient-to-r from-[#e2d5c3] via-[#ece3d4] to-[#c8b79b] text-[#0f1013] font-bold text-xs font-mono tracking-[0.18em] uppercase shadow-[0_0_25px_rgba(214,199,178,0.35)] hover:shadow-[0_0_40px_rgba(214,199,178,0.6)] transition-all duration-300 hover:scale-105 flex items-center gap-2.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#0f1013] group-hover:rotate-12 transition-transform duration-300" />
            <span>Explore The Museum</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>

          <button
            onClick={() => {
              playAudioCue('click');
              setResumeModalOpen(true);
            }}
            onMouseEnter={() => playAudioCue('hover')}
            className="px-6 py-3.5 rounded-full border border-[#d6c7b2]/25 bg-[#16181f]/80 backdrop-blur-md text-[#f5f0e8] font-mono text-xs tracking-wider uppercase hover:bg-[#20232c] hover:border-[#d6c7b2]/60 hover:text-[#d6c7b2] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Resume Archive</span>
          </button>

          <a
            href="#exhibition-hall"
            onClick={(e) => {
              e.preventDefault();
              playAudioCue('click');
              document.querySelector('#exhibition-hall')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => playAudioCue('hover')}
            className="px-6 py-3.5 rounded-full border border-[#d6c7b2]/15 bg-transparent text-[#d5cec2] font-mono text-xs tracking-wider uppercase hover:text-[#f5f0e8] hover:border-[#d6c7b2]/45 transition-all duration-300 cursor-pointer"
          >
            <span>Exhibition Hall</span>
          </a>
        </div>

        {/* Museum Wing Disciplines */}
        <div ref={techPillsRef} className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mb-12 opacity-90">
          <span className="text-[11px] font-mono text-[#d5cec2]/60 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d6c7b2]" /> Mediums:
          </span>
          {techBadges.map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#14161d] border border-[#d6c7b2]/15 text-[#d5cec2] hover:border-[#d6c7b2]/45 hover:text-[#d6c7b2] transition-colors"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Floating Quick Stats Cards */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl mx-auto"
        >
          {data.personal.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-4 sm:p-5 rounded-2xl text-left border border-[#d6c7b2]/10 hover:border-[#d6c7b2]/40 group transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[#f5f0e8]/90 mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-[#d5cec2]/60 leading-tight">{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="w-full flex justify-center">
          <a
            href="#introduction"
            onClick={(e) => {
              e.preventDefault();
              playAudioCue('click');
              document.querySelector('#introduction')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-14 inline-flex flex-col items-center gap-1.5 text-[#d5cec2]/55 hover:text-[#d6c7b2] transition-colors cursor-pointer group"
          >
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase">Scroll to Enter Room 01</span>
            <ArrowDown className="w-4 h-4 animate-bounce group-hover:text-[#d6c7b2]" />
          </a>
        </div>
      </div>
    </section>
  );
}
