'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { 
  MoveHorizontal, 
  RotateCcw, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  User
} from 'lucide-react';

interface Interactive3DAvatarProps {
  className?: string;
}

export default function Interactive3DAvatar({ className = '' }: Interactive3DAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // State
  const [viewMode, setViewMode] = useState<'full' | 'bust'>('full');
  const [manualXOffset, setManualXOffset] = useState<number>(0); // Left/Right translation in px (-120 to +120)
  const [manualRotationY, setManualRotationY] = useState<number>(0); // Drag rotation in deg (-45 to +45)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartOffset, setDragStartOffset] = useState<number>(0);
  const [dragStartRotation, setDragStartRotation] = useState<number>(0);

  // Pointer tracking coordinates (smoothed)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rawAngle, setRawAngle] = useState<{ rotX: number; rotY: number }>({ rotX: 0, rotY: 0 });
  const [isPointerOver, setIsPointerOver] = useState<boolean>(false);

  // Physics animation ref for buttery smooth lerping
  const targetRotX = useRef<number>(0);
  const targetRotY = useRef<number>(0);
  const currentRotX = useRef<number>(0);
  const currentRotY = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Track global pointer across the window or section
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1 based on distance from center
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Max tilt angles: RotY (left/right look) up to ~24deg, RotX (up/down look) up to ~18deg
      targetRotY.current = Math.max(-25, Math.min(25, deltaX * 24));
      targetRotX.current = Math.max(-18, Math.min(18, -deltaY * 18));

      setMousePos({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  // Smooth lerp loop for the 3D gaze
  useEffect(() => {
    const updatePhysics = () => {
      // Linear interpolation (lerp factor 0.08 for fluid weighty feel)
      const lerp = 0.08;
      currentRotX.current += (targetRotX.current - currentRotX.current) * lerp;
      currentRotY.current += (targetRotY.current - currentRotY.current) * lerp;

      setRawAngle({
        rotX: parseFloat(currentRotX.current.toFixed(2)),
        rotY: parseFloat(currentRotY.current.toFixed(2)),
      });

      animFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animFrameId.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Drag interaction handlers to slide & orbit left/right
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartOffset(manualXOffset);
    setDragStartRotation(manualRotationY);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [manualXOffset, manualRotationY]);

  const handlePointerMoveDrag = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    
    // Move left/right horizontally (clamped between -140px and +140px)
    const newOffset = Math.max(-140, Math.min(140, dragStartOffset + deltaX));
    setManualXOffset(newOffset);

    // Orbit angle based on drag distance
    const newRot = Math.max(-40, Math.min(40, dragStartRotation + deltaX * 0.25));
    setManualRotationY(newRot);
  }, [isDragging, dragStartX, dragStartOffset, dragStartRotation]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Manual Nudge Left / Right Buttons
  const nudgeLeft = () => {
    setManualXOffset(prev => Math.max(-140, prev - 35));
    setManualRotationY(prev => Math.max(-40, prev - 10));
  };

  const nudgeRight = () => {
    setManualXOffset(prev => Math.min(140, prev + 35));
    setManualRotationY(prev => Math.min(40, prev + 10));
  };

  const resetAll = () => {
    setManualXOffset(0);
    setManualRotationY(0);
  };

  // Compute final combined 3D transformation
  const combinedRotY = rawAngle.rotY + manualRotationY;
  const combinedRotX = rawAngle.rotX;

  // Specular light coordinates
  const lightX = 50 + combinedRotY * 1.5;
  const lightY = 50 - combinedRotX * 1.5;

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setIsPointerOver(true)}
      onMouseLeave={() => setIsPointerOver(false)}
    >
      {/* 3D Viewport Stage */}
      <div 
        className="relative w-full max-w-[420px] h-[500px] sm:h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        style={{ perspective: '1100px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMoveDrag}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Holographic Circular Floor Pedestal */}
        <div 
          className="absolute bottom-6 w-[280px] sm:w-[320px] h-[70px] pointer-events-none transition-transform duration-300"
          style={{
            transform: `rotateX(72deg) translateZ(-40px) translateX(${manualXOffset * 0.4}px)`,
          }}
        >
          {/* Glowing rings */}
          <div className="absolute inset-0 rounded-full border border-[#d6c7b2]/40 shadow-[0_0_35px_rgba(214,199,178,0.25)] animate-pulse" />
          <div className="absolute inset-3 rounded-full border border-[#00f5d4]/40 shadow-[0_0_20px_rgba(0,245,212,0.2)]" />
          <div className="absolute inset-8 rounded-full border border-dashed border-[#d6c7b2]/20" />
          <div className="absolute inset-0 bg-radial-gradient from-[#d6c7b2]/20 via-[#00f5d4]/5 to-transparent rounded-full blur-md" />
        </div>

        {/* Ambient Backlight Aura */}
        <div 
          className="absolute w-[260px] h-[340px] rounded-full bg-gradient-to-tr from-[#d6c7b2]/15 via-[#00f5d4]/10 to-[#9d4edd]/10 blur-[80px] pointer-events-none transition-transform duration-300"
          style={{
            transform: `translateX(${manualXOffset * 0.5}px) translateZ(-60px)`,
          }}
        />

        {/* 3D Tracking Card Layer (Pivots & Tracks Mouse Gaze) */}
        <div
          ref={cardRef}
          className="relative w-full h-full flex flex-col items-center justify-end pb-8 transition-transform ease-out duration-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(${manualXOffset}px) rotateY(${combinedRotY}deg) rotateX(${combinedRotX}deg)`,
          }}
        >
          {/* Depth Layer 1: Floating Holographic Background Plate */}
          <div 
            className="absolute inset-x-8 top-12 bottom-12 rounded-3xl border border-[#d6c7b2]/15 bg-gradient-to-b from-[#1a1d26]/60 via-[#12141a]/40 to-transparent backdrop-blur-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{
              transform: 'translateZ(-30px)',
            }}
          >
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:16px_16px] rounded-3xl" />
            
            {/* Top Status Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono tracking-wider text-[#d6c7b2] uppercase">
                  3D Hologram Feed
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/40">
                ROT: {combinedRotY.toFixed(0)}°
              </span>
            </div>
          </div>

          {/* Depth Layer 2: The Cutout Image (Tracks Pointer Directly) */}
          <div 
            className="relative z-20 w-[240px] sm:w-[280px] h-[380px] sm:h-[440px] flex items-end justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] pointer-events-none"
            style={{
              transform: 'translateZ(25px)',
            }}
          >
            <div 
              className="relative w-full h-full"
              style={viewMode === 'bust' ? {
                maskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 98%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 98%)'
              } : undefined}
            >
              <Image
                src={viewMode === 'full' ? '/profile_transparent.png' : '/profile_bust.png'}
                alt="Shashank Jha - Interactive 3D Developer"
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-contain object-bottom drop-shadow-[0_0_20px_rgba(214,199,178,0.15)] transition-all duration-300"
              />

              {/* Dynamic 3D Directional Lighting Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.7) 0%, rgba(214,199,178,0.2) 30%, transparent 70%)`,
                }}
              />
            </div>
          </div>

          {/* Depth Layer 3: Floating Parallax Badges in FRONT of the body */}
          <div 
            className="absolute top-16 -left-3 sm:left-1 z-30 pointer-events-none flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#16181f]/95 border border-[#d6c7b2]/30 backdrop-blur-md shadow-xl"
            style={{
              transform: `translateZ(65px) translateX(${combinedRotY * -0.6}px)`,
            }}
          >
            <Sparkles className="w-3 h-3 text-[#00f5d4]" />
            <span className="text-[10px] sm:text-[11px] font-mono text-[#f5f0e8] font-medium">
              Three.js & WebGL
            </span>
          </div>

          <div 
            className="absolute bottom-20 -right-3 sm:right-1 z-30 pointer-events-none flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#16181f]/95 border border-[#d6c7b2]/30 backdrop-blur-md shadow-xl"
            style={{
              transform: `translateZ(75px) translateX(${combinedRotY * -0.8}px)`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono text-[#d6c7b2] font-medium">
              Tracking Active
            </span>
          </div>
        </div>
      </div>

      {/* Tactile 3D Controller Panel (Move Left/Right, Mode Switch & Reset) */}
      <div className="w-full max-w-sm mt-3 px-4 py-3 rounded-2xl bg-[#14161d]/90 border border-[#d6c7b2]/20 backdrop-blur-md shadow-xl flex flex-col gap-3">
        {/* Top Controls: Nudge Left, Center, Nudge Right */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={nudgeLeft}
            title="Move Left"
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d6c7b2]/40 text-xs font-mono text-[#f5f0e8] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#d6c7b2]" />
            <span>Left</span>
          </button>

          <button
            onClick={resetAll}
            title="Reset to Center"
            className="py-1.5 px-3 rounded-xl bg-[#d6c7b2]/10 hover:bg-[#d6c7b2]/20 border border-[#d6c7b2]/30 text-xs font-mono text-[#d6c7b2] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={nudgeRight}
            title="Move Right"
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d6c7b2]/40 text-xs font-mono text-[#f5f0e8] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
          >
            <span>Right</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#d6c7b2]" />
          </button>
        </div>

        {/* Horizontal Slide Scrubber */}
        <div className="flex items-center gap-2 px-1">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#d6c7b2]/70 shrink-0" />
          <input
            type="range"
            min="-140"
            max="140"
            value={manualXOffset}
            onChange={(e) => {
              const val = Number(e.target.value);
              setManualXOffset(val);
              setManualRotationY(val * 0.25);
            }}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-[#d6c7b2]"
          />
        </div>

        {/* View Mode Toggle & Gaze Indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono text-white/60 pt-1 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-[#00f5d4]">
            <Eye className="w-3.5 h-3.5 animate-pulse" />
            <span>Watching Cursor</span>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode('full')}
              className={`px-2 py-0.5 rounded-md text-[10px] transition-colors cursor-pointer ${
                viewMode === 'full' 
                  ? 'bg-[#d6c7b2] text-[#0f1013] font-bold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Full Body
            </button>
            <button
              onClick={() => setViewMode('bust')}
              className={`px-2 py-0.5 rounded-md text-[10px] transition-colors cursor-pointer ${
                viewMode === 'bust' 
                  ? 'bg-[#d6c7b2] text-[#0f1013] font-bold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Portrait
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Hint */}
      <span className="text-[10px] font-mono text-[#d5cec2]/40 mt-2 flex items-center gap-1">
        💡 Move pointer to track gaze • Drag or use slider to shift position
      </span>
    </div>
  );
}
