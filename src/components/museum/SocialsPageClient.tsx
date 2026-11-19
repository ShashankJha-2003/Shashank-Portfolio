'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  Copy,
  Mail,
  FileText,
  Sparkles,
  MapPin,
  Volume2,
  VolumeX,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import SocialMediaHub from './SocialMediaHub';
import ResumeModal from '../ResumeModal';
import CustomCursor from '../CustomCursor';
import {
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
  GithubIcon,
  LinkedinIcon,
} from '../SocialIcons';

export default function SocialsPageClient() {
  const {
    data,
    soundEnabled,
    toggleSound,
    playAudioCue,
    setResumeModalOpen,
    setGardenStage,
    replayIntro,
  } = usePortfolio();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyPageUrl = () => {
    playAudioCue('click');
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2400);
    }
  };

  const handleCopyEmail = () => {
    playAudioCue('click');
    navigator.clipboard.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleEnterMuseum = () => {
    playAudioCue('whoosh');
    setGardenStage('portfolio');
  };

  const handleReplayIntro = () => {
    playAudioCue('whoosh');
    replayIntro();
  };

  const initials =
    data.personal.name
      .split(' ')
      .map((n) => n[0])
      .join('') || 'SJ';

  const quickBadges = [
    { name: 'Instagram', url: data.personal.instagram || 'https://instagram.com', color: '#E1306C', Icon: InstagramIcon },
    { name: 'Facebook', url: data.personal.facebook || 'https://facebook.com', color: '#1877F2', Icon: FacebookIcon },
    { name: 'Pinterest', url: data.personal.pinterest || 'https://pinterest.com', color: '#E60023', Icon: PinterestIcon },
    { name: 'GitHub', url: data.personal.github || 'https://github.com', color: '#d6c7b2', Icon: GithubIcon },
    { name: 'LinkedIn', url: data.personal.linkedin || 'https://linkedin.com', color: '#0A66C2', Icon: LinkedinIcon },
  ];

  return (
    <main className="relative min-h-screen bg-[#0f1013] text-[#f5f0e8] overflow-x-hidden font-sans selection:bg-[#f4a8c4]/25 selection:text-white">
      <CustomCursor />

      {/* Ambient Architectural Lighting Wash */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[min(96vw,920px)] h-[460px] bg-[radial-gradient(ellipse_at_top,rgba(244,168,196,0.16)_0%,rgba(214,199,178,0.06)_48%,transparent_75%)]" />
        <div className="absolute top-1/3 -left-32 w-[520px] h-[520px] bg-[#f4a8c4]/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-24 w-[580px] h-[580px] bg-[#d6c7b2]/[0.07] rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#d6c7b20d_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      {/* Top Architectural Route Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 pt-4 pb-3">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-full bg-[#14161c]/88 backdrop-blur-xl border border-[#d6c7b2]/18 shadow-[0_12px_38px_-10px_rgba(0,0,0,0.85)]">
            {/* Back to Museum */}
            <Link
              href="/"
              onClick={handleEnterMuseum}
              onMouseEnter={() => playAudioCue('hover')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1013] border border-[#d6c7b2]/25 hover:border-[#d6c7b2]/70 text-xs font-mono text-[#f5f0e8] hover:text-[#d6c7b2] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#d6c7b2]" />
              <span>Back to Museum</span>
            </Link>

            {/* Center Route Plaque */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f1013]/75 border border-[#f4a8c4]/25">
              <Share2 className="w-3.5 h-3.5 text-[#f4a8c4]" />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#f4a8c4] font-semibold">
                /socials
              </span>
              <span className="w-px h-3 bg-[#d6c7b2]/25" />
              <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#d5cec2]/80">
                Wing 08 • Social Archive
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPageUrl}
                onMouseEnter={() => playAudioCue('hover')}
                title="Copy shareable /socials link"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#f4a8c4]/35 bg-[#f4a8c4]/10 hover:bg-[#f4a8c4] text-[#f4a8c4] hover:text-[#0f1013] text-[11px] font-mono font-semibold transition-all cursor-pointer"
              >
                {copiedUrl ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedUrl ? 'Link Copied' : 'Share Page'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleSound();
                  playAudioCue('click');
                }}
                title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'border-[#d6c7b2]/50 bg-[#d6c7b2]/15 text-[#d6c7b2]'
                    : 'border-[#d6c7b2]/15 bg-[#0f1013] text-[#d5cec2]/60 hover:text-[#f5f0e8]'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  playAudioCue('click');
                  setResumeModalOpen(true);
                }}
                onMouseEnter={() => playAudioCue('hover')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#e2d5c3] to-[#c8b79b] text-[#0f1013] text-xs font-bold hover:shadow-[0_0_20px_rgba(214,199,178,0.45)] transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Resume</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-24">
        {/* Identity & Museum Wing Header */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          {/* Monogram Crest */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#f4a8c4]/40 via-[#d6c7b2]/30 to-transparent blur-lg" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#f4a8c4] via-[#ece3d4] to-[#d6c7b2] p-[2px] shadow-[0_0_35px_rgba(244,168,196,0.28)]">
                <div className="w-full h-full rounded-full bg-[#0f1013] flex items-center justify-center font-serif text-2xl font-semibold tracking-wider text-[#f5f0e8]">
                  {initials}
                </div>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f4a8c4]/30 bg-[#f4a8c4]/10 text-[10px] font-mono tracking-[0.26em] uppercase text-[#f4a8c4] font-bold mb-5">
            <Sparkles className="w-3 h-3" />
            <span>THE DIGITAL MUSEUM • DEDICATED SOCIAL WING</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#f5f0e8] leading-[1.05]">
            Connect Across <span className="italic text-[#f4a8c4]">Every Platform.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#d5cec2]/80 font-light max-w-2xl mx-auto leading-relaxed">
            {data.personal.name} — {data.personal.title}. Follow creative experiments, visual boards, open-source repositories, and career updates across all 5 connected channels.
          </p>

          {/* Identity Meta Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono text-[#d5cec2]/80">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#14161e] border border-[#d6c7b2]/18">
              <MapPin className="w-3.5 h-3.5 text-[#d6c7b2]" />
              {data.personal.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#14161e] border border-emerald-400/25 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {data.personal.status}
            </span>
          </div>

          {/* Instant 1-Click Icon Dock */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {quickBadges.map((item) => {
              const Icon = item.Icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playAudioCue('click')}
                  onMouseEnter={() => playAudioCue('hover')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#131620]/90 border border-white/12 hover:border-white/40 text-xs font-mono text-[#f5f0e8] transition-all hover:-translate-y-0.5"
                >
                  <span style={{ color: item.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span>{item.name}</span>
                  <ExternalLink className="w-3 h-3 text-[#8e877c]" />
                </a>
              );
            })}
          </div>
        </section>

        {/* PRIMARY INTERACTIVE SOCIAL MEDIA HUB PLAQUE */}
        <section className="museum-plaque rounded-[2rem] p-6 sm:p-9 border border-[#f4a8c4]/28 shadow-[0_30px_90px_rgba(0,0,0,0.75)] mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-[#d6c7b2]/14">
            <div>
              <div className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#d6c7b2]">
                EXHIBIT 08 // LIVE SOCIAL DIRECTORY
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f0e8] mt-1">
                Social Media <span className="italic text-[#f4a8c4]">Connect Lounge</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#d5cec2]/75 font-light mt-1.5 max-w-xl">
                Instagram, Facebook, Pinterest, GitHub, and LinkedIn in one dedicated gallery. Click <strong className="text-[#f4a8c4] font-medium">Connect / Edit Links</strong> anytime to attach and save your real profile URLs.
              </p>
            </div>
            <span className="self-start sm:self-end px-3 py-1 rounded-full bg-[#0f1013] border border-[#d6c7b2]/20 text-[10px] font-mono uppercase tracking-widest text-[#d6c7b2]">
              Route: /socials
            </span>
          </div>

          <SocialMediaHub />
        </section>

        {/* SECONDARY DIRECT ACCESS & MUSEUM NAVIGATION PLAQUES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {/* Direct Email */}
          <div className="museum-plaque rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-[#d6c7b2]/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/25 flex items-center justify-center text-[#d6c7b2]">
                <Mail className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email address"
                className="px-3 py-1.5 rounded-full bg-[#0f1013] border border-[#d6c7b2]/20 text-[10px] font-mono uppercase tracking-wider text-[#d5cec2] hover:bg-[#d6c7b2] hover:text-[#0f1013] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedEmail ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Direct Email Dispatch
              </div>
              <a
                href={`mailto:${data.personal.email}`}
                className="text-sm font-mono text-[#f5f0e8] hover:text-[#d6c7b2] transition-colors break-all mt-1 block"
              >
                {data.personal.email}
              </a>
            </div>
          </div>

          {/* Resume Archive */}
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setResumeModalOpen(true);
            }}
            onMouseEnter={() => playAudioCue('hover')}
            className="text-left museum-plaque rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-[#d6c7b2]/55 hover:-translate-y-0.5 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d6c7b2]/15 border border-[#d6c7b2]/35 flex items-center justify-center text-[#d6c7b2] group-hover:bg-[#d6c7b2] group-hover:text-[#0f1013] transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Curriculum Vitae
              </div>
              <div className="font-serif text-2xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors mt-0.5">
                View &amp; Download CV →
              </div>
            </div>
          </button>

          {/* Return to 3D Museum */}
          <Link
            href="/"
            onClick={handleEnterMuseum}
            onMouseEnter={() => playAudioCue('hover')}
            className="museum-plaque rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-[#f4a8c4]/55 hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f4a8c4]/12 border border-[#f4a8c4]/35 flex items-center justify-center text-[#f4a8c4] group-hover:bg-[#f4a8c4] group-hover:text-[#0f1013] transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Full Interactive Experience
              </div>
              <div className="font-serif text-2xl text-[#f5f0e8] group-hover:text-[#f4a8c4] transition-colors mt-0.5">
                Explore 3D Museum →
              </div>
            </div>
          </Link>
        </section>

        {/* Closing Inscription */}
        <footer className="text-center pt-10 border-t border-[#d6c7b2]/14">
          <p className="font-serif text-3xl sm:text-4xl font-light text-[#f5f0e8] mb-2">
            THANK YOU FOR <span className="italic text-[#f4a8c4]">CONNECTING.</span>
          </p>
          <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#8e877c] mb-7">
            THE DIGITAL MUSEUM • CURATED BY {data.personal.name.toUpperCase()}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              onClick={handleEnterMuseum}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e2d5c3] to-[#c8b79b] text-[#0f1013] font-mono text-[11px] font-bold tracking-widest uppercase inline-flex items-center gap-2 hover:shadow-[0_0_24px_rgba(214,199,178,0.45)] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to 3D Museum</span>
            </Link>
            <Link
              href="/"
              onClick={handleReplayIntro}
              className="px-5 py-2.5 rounded-full border border-[#d6c7b2]/25 bg-[#14161e] text-[#d5cec2] hover:border-[#d6c7b2]/60 hover:text-[#d6c7b2] font-mono text-[11px] tracking-widest uppercase inline-flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2]" />
              <span>Replay Museum Exterior</span>
            </Link>
          </div>
        </footer>
      </div>

      <ResumeModal />
    </main>
  );
}
