'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.06,
        ease: 'power2.out'
      });
    };

    const ringTicker = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.14;
      ringPos.y += (mouse.y - ringPos.y) * 0.14;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y
      });
    };

    gsap.ticker.add(ringTicker);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementsHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.group') ||
        target.closest('.interactive-target')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementsHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      gsap.ticker.remove(ringTicker);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementsHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Delicate Trailing Ring Follower */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full transition-all duration-200 border border-[#d6c7b2]/35 backdrop-blur-[1px] ${
          isHovered
            ? 'w-10 h-10 bg-[#d6c7b2]/10 border-[#d6c7b2]/70 scale-125'
            : 'w-6 h-6 bg-transparent'
        }`}
      />

      {/* Precision Center Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full bg-[#d6c7b2] transition-transform duration-100 shadow-[0_0_8px_rgba(214,199,178,0.6)] ${
          isHovered ? 'w-2 h-2 scale-125' : 'w-1.5 h-1.5 scale-100'
        }`}
      />
    </>
  );
}
