'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, FileText, Menu, X, Sparkles, Box, Layers, Share2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  museumMode?: '3d' | 'scroll';
  onToggleMuseumMode?: () => void;
  activeRoomId?: string;
  onSelectRoom?: (roomId: string) => void;
}

export default function Navbar({
  museumMode = '3d',
  onToggleMuseumMode,
  activeRoomId,
  onSelectRoom,
}: NavbarProps) {
  const {
    data,
    soundEnabled,
    toggleSound,
    playAudioCue,
    setResumeModalOpen,
    replayIntro
  } = usePortfolio();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollSpySection, setScrollSpySection] = useState('hero');

  const activeSection = museumMode === '3d' && activeRoomId ? activeRoomId : scrollSpySection;

  useEffect(() => {
    if (museumMode === '3d') {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Museum Room scroll spy
      const sections = [
        'hero',
        'introduction',
        'exhibition-hall',
        'technology-gallery',
        'timeline-gallery',
        'innovation-lab',
        'hobbies-gallery',
        'social-gallery',
        'floating-showcase',
        'exit-gallery',
      ];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240 && rect.bottom >= 240) {
            setScrollSpySection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [museumMode]);

  const navLinks = [
    { label: '01 Intro', href: '#introduction', id: 'introduction' },
    { label: '02 Projects', href: '#exhibition-hall', id: 'exhibition-hall' },
    { label: '03 Tech', href: '#technology-gallery', id: 'technology-gallery' },
    { label: '04 Timeline', href: '#timeline-gallery', id: 'timeline-gallery' },
    { label: '05 Lab', href: '#innovation-lab', id: 'innovation-lab' },
    { label: '06 Hobbies', href: '#hobbies-gallery', id: 'hobbies-gallery' },
    { label: '07 Socials', href: '#social-gallery', id: 'social-gallery' },
    { label: '08 UI Float', href: '#floating-showcase', id: 'floating-showcase' },
    { label: '09 Exit', href: '#exit-gallery', id: 'exit-gallery' },
  ];

  const handleLinkClick = (href: string, id?: string) => {
    playAudioCue('click');
    setMobileMenuOpen(false);
    if (museumMode === '3d' && onSelectRoom) {
      onSelectRoom(id || href.replace('#', ''));
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 sm:px-8 pt-4 pb-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <nav
          className={`flex items-center justify-between px-5 py-3 rounded-full transition-all duration-300 border ${scrolled
              ? 'bg-[#14161c]/90 backdrop-blur-xl border-[#d6c7b2]/15 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.85)]'
              : 'bg-[#14161c]/50 backdrop-blur-md border-[#d6c7b2]/10'
            }`}
        >
          {/* Logo / Monogram */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#hero', 'hero');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d6c7b2] via-[#ece3d4] to-[#8e877c] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(214,199,178,0.25)]">
              <div className="w-full h-full rounded-full bg-[#0f1013] flex items-center justify-center font-mono font-bold text-xs tracking-tight text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                {data.personal.name.split(' ').map(n => n[0]).join('') || 'SJ'}
              </div>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                {data.personal.name}
              </span>
              <span className="text-[10px] font-mono text-[#d6c7b2] tracking-wider uppercase">
                {data.personal.title}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 bg-[#0f1013]/60 border border-[#d6c7b2]/10 px-2 py-1.5 rounded-full">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.href, link.id)}
                  onMouseEnter={() => playAudioCue('hover')}
                  className={`px-2 py-1 text-[10px] xl:text-[11px] font-mono tracking-wide whitespace-nowrap transition-all duration-200 rounded-full cursor-pointer ${isActive
                      ? 'text-[#0f1013] bg-[#d6c7b2] font-bold shadow-[0_0_12px_rgba(214,199,178,0.3)]'
                      : 'text-[#d5cec2]/80 hover:text-[#f5f0e8] hover:bg-[#d6c7b2]/10'
                    }`}
                >
                  {link.label}
                </button>
              );
            })}
            <span className="w-px h-3.5 bg-[#d6c7b2]/20 mx-0.5" />
            <Link
              href="/socials"
              onClick={() => playAudioCue('click')}
              onMouseEnter={() => playAudioCue('hover')}
              title="Open Standalone /socials Route"
              className="px-2 py-1 text-[10px] xl:text-[11px] font-mono tracking-wide whitespace-nowrap rounded-full text-[#f4a8c4] hover:text-[#0f1013] hover:bg-[#f4a8c4] transition-all duration-200 inline-flex items-center gap-1 font-semibold"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden 2xl:inline">/socials</span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Switch between Real 3D Walkable Museum & Scroll Gallery */}
            {onToggleMuseumMode && (
              <button
                onClick={() => {
                  playAudioCue('click');
                  onToggleMuseumMode();
                }}
                onMouseEnter={() => playAudioCue('hover')}
                title={
                  museumMode === '3d'
                    ? 'Switch to Classic Vertical Scroll Gallery'
                    : 'Enter Full 3D Three.js Walkable Museum'
                }
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono border border-[#d6c7b2]/45 bg-[#d6c7b2]/15 text-[#d6c7b2] hover:text-[#0f1013] hover:bg-[#d6c7b2] transition-all cursor-pointer font-semibold"
              >
                {museumMode === '3d' ? (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>Scroll View</span>
                  </>
                ) : (
                  <>
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Museum</span>
                  </>
                )}
              </button>
            )}

            {/* Replay Museum Exterior Entrance Button */}
            <button
              onClick={() => {
                playAudioCue('click');
                replayIntro();
              }}
              onMouseEnter={() => playAudioCue('hover')}
              title="View Museum Exterior Cinematic Entrance"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border border-[#d6c7b2]/25 bg-[#d6c7b2]/8 text-[#d5cec2] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/55 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2]" />
              <span>Exterior</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => {
                toggleSound();
                playAudioCue('click');
              }}
              onMouseEnter={() => playAudioCue('hover')}
              title={soundEnabled ? 'Mute synthesized sound effects' : 'Enable synthesized sound effects'}
              className={`p-2 rounded-full border transition-all cursor-pointer ${soundEnabled
                  ? 'border-[#d6c7b2]/50 bg-[#d6c7b2]/15 text-[#d6c7b2] shadow-[0_0_12px_rgba(214,199,178,0.3)]'
                  : 'border-[#d6c7b2]/10 bg-[#d6c7b2]/5 text-[#d5cec2]/50 hover:text-[#f5f0e8]'
                }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Resume Button */}
            <button
              onClick={() => {
                playAudioCue('click');
                setResumeModalOpen(true);
              }}
              onMouseEnter={() => playAudioCue('hover')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#e2d5c3] to-[#c8b79b] text-[#0f1013] text-xs font-bold hover:shadow-[0_0_20px_rgba(214,199,178,0.45)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#0f1013]" />
              <span>Resume</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                playAudioCue('click');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded-full border border-[#d6c7b2]/10 bg-[#d6c7b2]/5 text-[#f5f0e8] lg:hidden hover:text-[#d6c7b2] cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-2xl bg-[#14161c]/95 backdrop-blur-2xl border border-[#d6c7b2]/15 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.href, link.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-mono text-[#d5cec2] hover:text-[#d6c7b2] hover:bg-[#d6c7b2]/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{link.label}</span>
                <span className="text-xs text-[#d5cec2]/40">→</span>
              </button>
            ))}

            <Link
              href="/socials"
              onClick={() => {
                playAudioCue('click');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-mono text-[#f4a8c4] bg-[#f4a8c4]/10 border border-[#f4a8c4]/25 hover:bg-[#f4a8c4] hover:text-[#0f1013] transition-all flex items-center justify-between font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5" />
                <span>Social Links (/socials)</span>
              </span>
              <span className="text-xs">→</span>
            </Link>

            {onToggleMuseumMode && (
              <div className="pt-2 border-t border-[#d6c7b2]/10 flex items-center justify-between text-xs font-mono text-[#d5cec2]/70 px-2">
                <span>Museum View:</span>
                <button
                  onClick={() => {
                    playAudioCue('click');
                    setMobileMenuOpen(false);
                    onToggleMuseumMode();
                  }}
                  className="text-[#d6c7b2] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  {museumMode === '3d' ? 'Switch to Scroll View' : 'Enter 3D Museum'}
                </button>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between text-xs font-mono text-[#d5cec2]/70 px-2">
              <span>Intro:</span>
              <button
                onClick={() => {
                  playAudioCue('click');
                  setMobileMenuOpen(false);
                  replayIntro();
                }}
                className="text-[#d6c7b2] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replay Museum Exterior</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
