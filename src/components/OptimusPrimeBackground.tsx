'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Eye, EyeOff, Shield, RefreshCw, Maximize2, MoveHorizontal } from 'lucide-react';

interface OptimusPrimeBackgroundProps {
  className?: string;
}

export default function OptimusPrimeBackground({ className = '' }: OptimusPrimeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxLayerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Video scrub and motion physics state
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isAutoPlayRef = useRef(true);

  const scrollData = useRef({
    velocity: 0,
    lastScrollY: 0,
    targetRotateX: 0,
    currentRotateX: 0,
    targetRotateY: 0,
    currentRotateY: 0,
    progress: 0,
    mouseNormX: 0,
    mouseNormY: 0,
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCinematic, setIsCinematic] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [positionMode, setPositionMode] = useState<'showcase' | 'center'>('showcase');
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synthesized Cybertronian sound effect
  const playCyberSound = useCallback((type: 'click' | 'toggle') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'toggle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {
      // AudioContext suppressed or not allowed
    }
  }, [soundEnabled]);

  // Handle Video Metadata & Initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultPlaybackRate = 1.0;
    video.playbackRate = 1.0;

    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
      video.playbackRate = 1.0;
      if (isAutoPlayRef.current) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0.01;
      }
      targetTimeRef.current = 0.01;
      currentTimeRef.current = 0.01;
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedMetadata);
    };
  }, []);

  // Sync isAutoPlay ref
  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      if (isAutoPlay) {
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isAutoPlay]);

  // ScrollTrigger loop: Scrubs video frame and 3D angle when user scrolls
  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      const currentScroll = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentScroll / docHeight, 0), 1) : 0;

      const delta = currentScroll - scrollData.current.lastScrollY;
      scrollData.current.velocity = delta;
      scrollData.current.lastScrollY = currentScroll;
      scrollData.current.progress = progress;

      // ScrollTrigger: Map scroll progress (0.0 to 1.0) directly to video turnaround timeline
      if (videoRef.current && videoRef.current.duration && !isAutoPlayRef.current) {
        const duration = videoRef.current.duration;
        targetTimeRef.current = progress * duration;
      }

      // Dynamic 3D tilt response to scroll speed
      scrollData.current.targetRotateX = Math.max(Math.min(-delta * 0.014, 2.5), -2.5);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      scrollData.current.mouseNormX = nx;
      scrollData.current.mouseNormY = ny;

      // Subtle 3D perspective response to cursor
      scrollData.current.targetRotateY = nx * 1.5;
    };

    const updateMotion = () => {
      const data = scrollData.current;
      const video = videoRef.current;

      // Scrub video to target scroll time with smooth hardware seek
      if (video && video.duration && !isAutoPlayRef.current) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.004) {
          currentTimeRef.current += diff * 0.18;
          if (!video.seeking) {
            video.currentTime = Math.max(0, Math.min(video.duration - 0.01, currentTimeRef.current));
          }
        }
      }

      // Smooth 3D perspective lerp
      data.currentRotateX += (data.targetRotateX - data.currentRotateX) * 0.08;
      data.currentRotateY += (data.targetRotateY - data.currentRotateY) * 0.06;

      // Decay velocity tilts
      data.targetRotateX *= 0.94;

      if (parallaxLayerRef.current) {
        parallaxLayerRef.current.style.transform = `perspective(1200px) rotateX(${data.currentRotateX.toFixed(2)}deg) rotateY(${data.currentRotateY.toFixed(2)}deg)`;
      }

      const nextProgress = Math.round(data.progress * 100);
      setScrollProgress((prev) => (prev !== nextProgress ? nextProgress : prev));
      animId = requestAnimationFrame(updateMotion);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Floating Energon particle system canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const count = 45;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
    }[] = [];

    const colors = ['#00e5ff', '#38bdf8', '#ffd700', '#ff3344'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.2,
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.04 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const renderParticles = () => {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseImpactX = scrollData.current.mouseNormX * 0.4;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx + mouseImpactX;

        // Reset particles floating past top
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const currentAlpha = Math.max(0, Math.min(1, p.alpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.25));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(renderParticles);
    };

    animId = requestAnimationFrame(renderParticles);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 
        ===================================================================
        OPTIMUS PRIME SCROLLTRIGGER 3D STAGE
        - Adjusted according to screen dimensions:
          * Sized with responsive height (h-[76vh] sm:h-[82vh] lg:h-[88vh]) and object-contain
            so Optimus Prime is 100% visible from his helmet horns down to his legs!
          * On desktop, positioned toward the right (showcase column) so hero text on left is crystal clear!
          * On mobile/tablet, centered as an epic backdrop!
          * Rotates 360-degrees frame-by-frame smoothly with page scroll!
        ===================================================================
      */}
      <div
        ref={parallaxLayerRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform transform-gpu pointer-events-none"
        style={{
          transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
          transformOrigin: 'center center',
        }}
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-700 ease-out pointer-events-none ${positionMode === 'center'
              ? 'translate-x-0'
              : 'translate-x-0 lg:translate-x-[18vw] xl:translate-x-[14vw]'
            }`}
        >
          {/* Cybertronian Radial Aura Halo directly behind Optimus Prime */}
          <div className="absolute w-[380px] sm:w-[560px] lg:w-[760px] h-[380px] sm:h-[560px] lg:h-[760px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.22)_0%,_rgba(0,229,255,0.07)_38%,_transparent_72%)] blur-3xl pointer-events-none -z-10 animate-pulse duration-1000" />

          {/* Optimus Prime 3D Video & Fallback Poster */}
          <video
            ref={videoRef}
            src="/optimus_prime_video.mp4"
            poster="/optimus_poster.jpg"
            muted
            loop
            playsInline
            preload="auto"
            className={`transition-all duration-700 ease-out select-none pointer-events-none ${fitMode === 'contain'
                ? 'h-[76vh] sm:h-[82vh] lg:h-[88vh] max-h-[920px] w-auto aspect-[16/9] object-contain'
                : 'w-screen h-screen object-cover'
              } ${isCinematic
                ? 'opacity-100 brightness-[1.12] contrast-[1.14] saturate-[1.25]'
                : 'opacity-92 brightness-[1.06] contrast-[1.10] saturate-[1.20]'
              } filter drop-shadow-[0_0_45px_rgba(56,189,248,0.25)]`}
          />
        </div>
      </div>

      {/* Atmospheric Layer 1: Soft radial vignette preserving Optimus Prime's full clarity */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(15,16,19,0.45)_80%,_#0f1013_100%)] pointer-events-none" />

      {/* Atmospheric Layer 2: Smooth Top & Bottom Gradients for seamless Navbar & Footer blending */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0f1013] via-[#0f1013]/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0f1013] via-[#0f1013]/60 to-transparent pointer-events-none" />

      {/* Atmospheric Layer 3: Cybertronian Dual Ambient Tone Harmonizers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f1013]/40 via-transparent to-[#38bdf8]/10 mix-blend-color-dodge pointer-events-none" />

      {/* Atmospheric Layer 4: Sci-Fi Cybernetic Scanline Texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56, 189, 248, 0.08) 2px, rgba(56, 189, 248, 0.08) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Atmospheric Layer 5: Floating Energon particle motes canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
      />

      {/* 
        ===================================================================
        AUTOBOT SCROLLTRIGGER HUD TELEMETRY & SCREEN ADJUSTMENT CONTROLS
        ===================================================================
      */}
      {isHudVisible && (
        <div className="fixed bottom-6 left-6 z-30 pointer-events-auto hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#38bdf8]/35 bg-[#10141e]/90 backdrop-blur-xl text-[#38bdf8] shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#38bdf8]/70 group">
          {/* Pulsing Autobot Shield Icon */}
          <div className="relative flex items-center justify-center w-5 h-5">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#38bdf8] opacity-60" />
            <Shield className="relative w-4 h-4 text-[#38bdf8]" />
          </div>

          {/* Telemetry info */}
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
            <span className="font-bold text-white tracking-widest">OPTIMUS PRIME</span>
            <span className="text-[#38bdf8]/40">|</span>
            <span className="text-[#38bdf8] font-semibold">
              {isAutoPlay ? 'AUTO 3D' : 'SCROLLTRIGGER'}
            </span>
            <span className="text-[#38bdf8]/40">|</span>
            <span className="text-white/80">ROTATION {scrollProgress}%</span>
          </div>

          {/* Quick HUD Screen & Mode Adjustment Buttons */}
          <div className="flex items-center gap-1.5 pl-2.5 border-l border-[#38bdf8]/20">
            {/* Toggle ScrollTrigger vs Auto Play */}
            <button
              type="button"
              onClick={() => {
                playCyberSound('toggle');
                setIsAutoPlay(!isAutoPlay);
              }}
              title={isAutoPlay ? 'Switch to ScrollTrigger Mode (turns on scroll)' : 'Switch to Continuous Auto 3D'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${isAutoPlay ? 'text-white bg-[#38bdf8]/35' : 'text-[#38bdf8]/75 hover:text-white hover:bg-white/10'
                }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Screen Position: Showcase (Right) vs Center */}
            <button
              type="button"
              onClick={() => {
                playCyberSound('toggle');
                setPositionMode(positionMode === 'showcase' ? 'center' : 'showcase');
              }}
              title={positionMode === 'showcase' ? 'Position: Showcase (Desktop Right) - Click for Center' : 'Position: Center - Click for Showcase'}
              className={`px-2 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 ${positionMode === 'showcase' ? 'text-white bg-[#38bdf8]/35' : 'text-[#38bdf8]/75 hover:text-white hover:bg-white/10'
                }`}
            >
              <MoveHorizontal className="w-3 h-3" />
              <span>{positionMode === 'showcase' ? 'RIGHT' : 'CTR'}</span>
            </button>

            {/* Toggle Screen Fit: Contain (Full Figure) vs Cover (Full Bleed) */}
            <button
              type="button"
              onClick={() => {
                playCyberSound('toggle');
                setFitMode(fitMode === 'contain' ? 'cover' : 'contain');
              }}
              title={fitMode === 'contain' ? 'Fit: Head-to-Toe Contain - Click for Full Cover' : 'Fit: Full Cover - Click for Contain'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${fitMode === 'contain' ? 'text-white bg-[#38bdf8]/35' : 'text-[#38bdf8]/75 hover:text-white hover:bg-white/10'
                }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Cinematic Opacity Toggle */}
            <button
              type="button"
              onClick={() => {
                playCyberSound('toggle');
                setIsCinematic(!isCinematic);
              }}
              title={isCinematic ? 'Super Vivid Mode Active - Click for Standard' : 'Click for Super Vivid Cinematic Mode'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${isCinematic ? 'text-white bg-[#38bdf8]/35' : 'text-[#38bdf8]/75 hover:text-white hover:bg-white/10'
                }`}
            >
              <span className="text-[10px] font-mono font-bold px-1">CINE</span>
            </button>

            {/* Minimize HUD */}
            <button
              type="button"
              onClick={() => {
                playCyberSound('click');
                setIsHudVisible(false);
              }}
              title="Minimize HUD Controls"
              className="p-1.5 rounded-full text-[#38bdf8]/50 hover:text-[#38bdf8] transition-colors cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Restoring HUD button when minimized */}
      {!isHudVisible && (
        <button
          type="button"
          onClick={() => {
            playCyberSound('click');
            setIsHudVisible(true);
          }}
          title="Show Autobot Telemetry & Controls"
          className="fixed bottom-6 left-6 z-30 pointer-events-auto p-2.5 rounded-full border border-[#38bdf8]/35 bg-[#10141e]/90 backdrop-blur-xl text-[#38bdf8] hover:border-[#38bdf8]/70 hover:text-white transition-all shadow-[0_8px_32px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
