'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Pause, Play, Eye, EyeOff } from 'lucide-react';

interface MechaBackgroundProps {
  className?: string;
}

export default function MechaBackground({ className = '' }: MechaBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxLayerRef = useRef<HTMLDivElement>(null);

  // Scroll and motion state
  const scrollData = useRef({
    currentY: 0,
    targetY: 0,
    velocity: 0,
    lastScrollY: 0,
    targetScale: 1.06,
    currentScale: 1.06,
    targetRotateX: 0,
    currentRotateX: 0,
    targetRotateY: 0,
    currentRotateY: 0,
    progress: 0,
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isCinematic, setIsCinematic] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Parallax physics loop using requestAnimationFrame for buttery smooth 60/120fps motion
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

      // Parallax travel distance: allows video to gracefully glide along with the user's scroll
      // A negative translation moves the background upward as the user scrolls down, creating depth
      const maxTravel = window.innerHeight * 0.35; // 35vh travel
      scrollData.current.targetY = -progress * maxTravel;

      // Slight dynamic scale and tilt based on scroll velocity
      const velocityImpact = Math.min(Math.abs(delta) * 0.0015, 0.06);
      scrollData.current.targetScale = 1.06 + velocityImpact;
      scrollData.current.targetRotateX = Math.max(Math.min(-delta * 0.02, 3), -3);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Subtle 3D perspective response to cursor for high-depth immersion
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      scrollData.current.targetRotateY = nx * 1.5;
    };

    const updateMotion = () => {
      const data = scrollData.current;

      // Lerp (smooth interpolation)
      const lerpSpeed = 0.08;
      data.currentY += (data.targetY - data.currentY) * lerpSpeed;
      data.currentScale += (data.targetScale - data.currentScale) * 0.06;
      data.currentRotateX += (data.targetRotateX - data.currentRotateX) * 0.08;
      data.currentRotateY += (data.targetRotateY - data.currentRotateY) * 0.05;

      // Decay velocity impacts
      data.targetRotateX *= 0.94;
      data.targetScale += (1.06 - data.targetScale) * 0.02;

      if (parallaxLayerRef.current) {
        parallaxLayerRef.current.style.transform = `translate3d(0, ${data.currentY.toFixed(2)}px, 0) scale(${data.currentScale.toFixed(4)}) rotateX(${data.currentRotateX.toFixed(2)}deg) rotateY(${data.currentRotateY.toFixed(2)}deg)`;
      }

      setScrollProgress(Math.round(data.progress * 100));
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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 
        Parallax Video Container 
        Tall wrapper (135vh, top: -15vh) ensures plenty of vertical travel room so edges never show 
      */}
      <div
        ref={parallaxLayerRef}
        className="absolute w-full h-[135vh] -top-[15vh] left-0 will-change-transform transform-gpu"
        style={{
          transform: 'translate3d(0, 0, 0) scale(1.06)',
          transformOrigin: 'center center',
          perspective: '1200px',
        }}
      >
        <video
          ref={videoRef}
          src="/mecha1.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
            isVideoLoaded ? (isCinematic ? 'opacity-85' : 'opacity-50') : 'opacity-0'
          } filter contrast-[1.08] brightness-[0.82] saturate-[1.15]`}
        />
      </div>

      {/* Atmospheric Layer 1: Radial Vignette to keep center readable & frame edges dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_rgba(15,16,19,0.75)_70%,_#0f1013_100%)] pointer-events-none" />

      {/* Atmospheric Layer 2: Top & Bottom Smooth Gradients for seamless Navbar and Footer blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1013] via-transparent to-[#0f1013] opacity-80 pointer-events-none" />

      {/* Atmospheric Layer 3: Warm Cashmere & Charcoal Dual Ambient Tone Harmonizers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f1013]/60 via-transparent to-[#d6c7b2]/5 mix-blend-color-dodge pointer-events-none" />

      {/* Atmospheric Layer 4: Sci-Fi Cybernetic Scanline Texture */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(214, 199, 178, 0.08) 2px, rgba(214, 199, 178, 0.08) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* 
        Sci-Fi Mecha HUD Telemetry & Scroll Tracker Badge
        Interactive controls (Pointer events enabled on buttons only)
      */}
      {isHudVisible && (
        <div className="fixed bottom-6 left-6 z-30 pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-2 rounded-full border border-[#d6c7b2]/20 bg-[#16181f]/85 backdrop-blur-md text-[#d6c7b2] shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#d6c7b2]/45 group">
          {/* Pulsing Mecha Reactor Icon */}
          <div className="relative flex items-center justify-center w-5 h-5">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#d6c7b2] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d6c7b2]" />
          </div>

          {/* Telemetry info */}
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
            <span className="font-semibold text-white/90">MECHA-01</span>
            <span className="text-[#d6c7b2]/50">|</span>
            <span className="text-[#d6c7b2]">DEPTH {scrollProgress}%</span>
          </div>

          {/* Quick HUD Action Buttons */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#d6c7b2]/20">
            {/* Play / Pause toggle */}
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause Mecha Video' : 'Play Mecha Video'}
              className="p-1 rounded-full text-[#d6c7b2]/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Audio Mute / Unmute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-1 rounded-full text-[#d6c7b2]/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Cinematic Opacity Toggle */}
            <button
              type="button"
              onClick={() => setIsCinematic(!isCinematic)}
              title={isCinematic ? 'Standard Opacity' : 'Cinematic Opacity'}
              className={`p-1 rounded-full transition-colors ${
                isCinematic ? 'text-white bg-[#d6c7b2]/30' : 'text-[#d6c7b2]/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[10px] font-mono px-1 font-semibold">CINE</span>
            </button>

            {/* Minimize HUD */}
            <button
              type="button"
              onClick={() => setIsHudVisible(false)}
              title="Minimize HUD"
              className="p-1 rounded-full text-[#d6c7b2]/40 hover:text-[#d6c7b2] transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Restoring HUD pill when minimized */}
      {!isHudVisible && (
        <button
          type="button"
          onClick={() => setIsHudVisible(true)}
          title="Show Mecha Telemetry"
          className="fixed bottom-6 left-6 z-30 pointer-events-auto p-2.5 rounded-full border border-[#d6c7b2]/20 bg-[#16181f]/85 backdrop-blur-md text-[#d6c7b2] hover:border-[#d6c7b2]/60 hover:text-white transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
