'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import GardenIntroOverlay from '../components/GardenIntroOverlay';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import IntroductionGallery from '../components/museum/IntroductionGallery';
import ExhibitionHall from '../components/museum/ExhibitionHall';
import TechnologyGallery from '../components/museum/TechnologyGallery';
import TimelineGallery from '../components/museum/TimelineGallery';
import InnovationLab from '../components/museum/InnovationLab';
import HobbiesGallery from '../components/museum/HobbiesGallery';
import SocialMediaGallery from '../components/museum/SocialMediaGallery';
import FloatingShowcaseGallery from '../components/museum/FloatingShowcaseGallery';
import ExitGallery from '../components/museum/ExitGallery';
import MuseumFloorHud from '../components/museum/MuseumFloorHud';
import ResumeModal from '../components/ResumeModal';
import CustomCursor from '../components/CustomCursor';
import { usePortfolio } from '../context/PortfolioContext';

// Dynamically load WebGL canvases on client side only to avoid SSR issues
const GardenCanvas = dynamic(() => import('../components/GardenCanvas'), {
  ssr: false,
});

const ThreeDMuseumExperience = dynamic(
  () => import('../components/museum/three/ThreeDMuseumExperience'),
  { ssr: false }
);

export default function Home() {
  const { gardenStage } = usePortfolio();
  const [museumMode, setMuseumMode] = useState<'3d' | 'scroll'>('3d');
  const [active3DRoomId, setActive3DRoomId] = useState<string>('hero');
  const [requestedRoom, setRequestedRoom] = useState<{ id: string; seq: number } | null>(null);

  const handleSelect3DRoom = (roomId: string) => {
    setRequestedRoom({ id: roomId, seq: Date.now() });
  };

  return (
    <main className="relative min-h-screen bg-[#0f1013] text-[#f5f0e8] overflow-x-hidden font-sans">
      {/* 
        ===================================================================
        LOADING & CINEMATIC MUSEUM EXTERIOR ENTRANCE
        Photorealistic Twilight Museum Facade Video & Portal Fly-Through
        ===================================================================
      */}
      {gardenStage !== 'portfolio' && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black">
          <GardenCanvas />
          <GardenIntroOverlay />
        </div>
      )}

      {/* Custom Animated Morphing Cursor Blob */}
      <CustomCursor />

      {/* 
        ===================================================================
        THE DIGITAL MUSEUM — INNER PORTFOLIO
        Default: Real Walkable Three.js + GSAP 3D Architectural Museum
        Toggleable: 2D Architectural Scroll Gallery
        ===================================================================
      */}
      {gardenStage === 'portfolio' && (
        <div className="relative z-10 w-full min-h-screen bg-[#0f1013] transition-opacity duration-700 animate-in fade-in">
          {/* Museum Top Navigation Bar (Controls both 3D Camera Teleport & Scroll View) */}
          <Navbar
            museumMode={museumMode}
            onToggleMuseumMode={() => setMuseumMode((m) => (m === '3d' ? 'scroll' : '3d'))}
            activeRoomId={active3DRoomId}
            onSelectRoom={handleSelect3DRoom}
          />

          {museumMode === '3d' ? (
            /* REAL THREE.JS + GSAP 3D WALKABLE ARCHITECTURAL MUSEUM */
            <ThreeDMuseumExperience
              requestedRoom={requestedRoom}
              onRoomChange={setActive3DRoomId}
            />
          ) : (
            /* CLASSIC ARCHITECTURAL 7-ROOM VERTICAL SCROLL GALLERY */
            <>
              <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[620px] h-[620px] bg-[#d6c7b2]/[0.06] rounded-full blur-[150px]" />
                <div className="absolute top-1/3 right-1/4 w-[520px] h-[520px] bg-[#2a2d37]/25 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-[#c8b79b]/[0.05] rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#d6c7b20a_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
              </div>

              <div className="relative z-10">
                <HeroSection />
                <IntroductionGallery />
                <ExhibitionHall />
                <TechnologyGallery />
                <TimelineGallery />
                <InnovationLab />
                <HobbiesGallery />
                <SocialMediaGallery />
                <FloatingShowcaseGallery />
                <ExitGallery />
              </div>

              <MuseumFloorHud />
            </>
          )}
        </div>
      )}

      {/* Formatted CV Viewer & Live Resume Editor Modal */}
      <ResumeModal />
    </main>
  );
}
