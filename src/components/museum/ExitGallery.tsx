'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, FileText, Send, CheckCircle2, Copy, ArrowUp, Sparkles, MapPin, Phone, Share2, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import MuseumRoomHeader from './MuseumRoomHeader';

export default function ExitGallery() {
  const { data, playAudioCue, setResumeModalOpen, replayIntro } = usePortfolio();

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    playAudioCue('click');
    navigator.clipboard.writeText(data.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    playAudioCue('click');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      playAudioCue('whoosh');
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 900);
  };

  return (
    <section
      id="exit-gallery"
      className="relative pt-28 sm:pt-36 pb-28 px-4 sm:px-8 border-t border-[#d6c7b2]/15 overflow-hidden"
    >
      {/* Warm Twilight Architectural Overhead Wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d6c7b2]/45 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(96vw,880px)] h-96 bg-[radial-gradient(ellipse_at_top,rgba(214,199,178,0.14)_0%,transparent_72%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="09"
          wingLabel="THE EXIT GALLERY — CONNECT & COLLABORATE"
          title="The Exhibition"
          accentWord="Doesn't End Here."
          subtitle="There is always something new to create. Send a direct museum dispatch, download the resume archive, or revisit the Social Media Lounge & Floating Frontend Showcase."
        />

        {/* Quick Portal Banner to Dedicated Social Media Room / Route */}
        <div className="mb-8 px-5 py-4 rounded-2xl museum-plaque border border-[#ec4899]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ec4899]/15 border border-[#ec4899]/40 flex items-center justify-center text-[#f4a8c4] shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f4a8c4] font-bold">
                Room 07 &amp; Standalone Route
              </div>
              <div className="text-xs sm:text-sm text-[#d5cec2]/85 font-light">
                Looking for Instagram, Facebook, Pinterest, GitHub &amp; LinkedIn? Explore the dedicated Social Media Lounge.
              </div>
            </div>
          </div>
          <Link
            href="/socials"
            onClick={() => playAudioCue('click')}
            onMouseEnter={() => playAudioCue('hover')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ec4899]/15 border border-[#ec4899]/45 hover:bg-[#ec4899] text-[#f9a8d4] hover:text-[#0f1013] text-[11px] font-mono uppercase tracking-wider font-bold transition-all shrink-0"
          >
            <span>Open /socials</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Direct Exit Plaques (Email, LinkedIn, GitHub, Resume Download) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Email Plaque */}
          <div className="museum-plaque rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#d6c7b2]/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/25 flex items-center justify-center text-[#d6c7b2]">
                <Mail className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email address"
                className="p-2 rounded-lg bg-[#0f1013] border border-[#d6c7b2]/20 text-[#d5cec2] hover:bg-[#d6c7b2] hover:text-[#0f1013] transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Direct Email
              </div>
              <a
                href={`mailto:${data.personal.email}`}
                className="text-xs font-mono text-[#f5f0e8] hover:text-[#d6c7b2] transition-colors break-all"
              >
                {data.personal.email}
              </a>
            </div>
          </div>

          {/* LinkedIn Plaque */}
          <a
            href={data.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playAudioCue('click')}
            onMouseEnter={() => playAudioCue('hover')}
            className="museum-plaque rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#d6c7b2]/55 hover:-translate-y-1 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/25 flex items-center justify-center text-[#d6c7b2] group-hover:bg-[#d6c7b2] group-hover:text-[#0f1013] transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Professional Network
              </div>
              <div className="font-serif text-xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                LinkedIn Profile →
              </div>
            </div>
          </a>

          {/* GitHub Plaque */}
          <a
            href={data.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playAudioCue('click')}
            onMouseEnter={() => playAudioCue('hover')}
            className="museum-plaque rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#d6c7b2]/55 hover:-translate-y-1 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/25 flex items-center justify-center text-[#d6c7b2] group-hover:bg-[#d6c7b2] group-hover:text-[#0f1013] transition-colors">
              <GithubIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Code Archive
              </div>
              <div className="font-serif text-xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                GitHub Repositories →
              </div>
            </div>
          </a>

          {/* Resume Download Plaque */}
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setResumeModalOpen(true);
            }}
            onMouseEnter={() => playAudioCue('hover')}
            className="text-left museum-plaque rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#d6c7b2]/55 hover:-translate-y-1 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d6c7b2]/15 border border-[#d6c7b2]/35 flex items-center justify-center text-[#d6c7b2] group-hover:bg-[#d6c7b2] group-hover:text-[#0f1013] transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8e877c]">
                Curriculum Vitae
              </div>
              <div className="font-serif text-xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                View &amp; Download CV →
              </div>
            </div>
          </button>
        </div>

        {/* Museum Guestbook & Collaboration Dispatch */}
        <div className="museum-plaque rounded-[2rem] p-7 sm:p-10 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#d6c7b2]">
                  VISITOR GUESTBOOK &amp; DISPATCH
                </span>
                <h3 className="font-serif text-3xl text-[#f5f0e8] mt-1.5">
                  Leave a Note for the Curator
                </h3>
                <p className="text-sm text-[#d5cec2]/80 font-light mt-2 leading-relaxed">
                  Open to full-time Software Engineering &amp; Frontend roles, 3D creative development, and ambitious collaborations.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#d6c7b2]/12 text-xs font-mono text-[#d5cec2]/80">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#d6c7b2]" />
                  <span>{data.personal.location}</span>
                </div>
                {data.personal.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#d6c7b2]" />
                    <span>{data.personal.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              {isSubmitted ? (
                <div className="py-10 px-6 text-center rounded-2xl bg-[#0f1013] border border-[#d6c7b2]/25 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#d6c7b2] mx-auto" />
                  <h4 className="font-serif text-2xl text-[#f5f0e8]">Dispatch Recorded in the Archive</h4>
                  <p className="text-xs text-[#d5cec2]/75 max-w-md mx-auto">
                    Thank you for signing the Digital Museum guestbook. Shashank will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Your Name *"
                      className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/18 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] transition-colors"
                    />
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Your Email *"
                      className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/18 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] transition-colors"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Share a role, collaboration idea, or note from your museum visit..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/18 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => playAudioCue('hover')}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e2d5c3] via-[#ece3d4] to-[#c8b79b] text-[#0f1013] font-mono text-xs font-bold tracking-[0.18em] uppercase shadow-[0_0_25px_rgba(214,199,178,0.28)] hover:shadow-[0_0_38px_rgba(214,199,178,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Recording Dispatch...' : 'Send Museum Dispatch'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* GRAND CLOSING INSCRIPTION: THANK YOU FOR VISITING               */}
        {/* =============================================================== */}
        <div className="text-center pt-12 border-t border-[#d6c7b2]/15">
          <div className="w-12 h-6 museum-arch-frame border-t border-x border-[#d6c7b2]/35 mx-auto mb-6 flex items-end justify-center pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6c7b2]" />
          </div>

          <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#f5f0e8] mb-3">
            THANK YOU FOR <span className="italic text-[#d6c7b2]">VISITING.</span>
          </p>
          <p className="text-xs font-mono tracking-[0.22em] uppercase text-[#8e877c] mb-8">
            THE DIGITAL MUSEUM • FOUNDED &amp; CURATED BY {data.personal.name.toUpperCase()}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pb-10">
            <button
              type="button"
              onClick={() => {
                playAudioCue('click');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-full border border-[#d6c7b2]/25 bg-[#14161e] text-[#f5f0e8] hover:border-[#d6c7b2]/60 hover:text-[#d6c7b2] font-mono text-[11px] tracking-widest uppercase inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Return to Entrance Hall</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playAudioCue('click');
                replayIntro();
              }}
              className="px-5 py-2.5 rounded-full border border-[#d6c7b2]/20 bg-transparent text-[#d5cec2] hover:border-[#d6c7b2]/50 hover:text-[#d6c7b2] font-mono text-[11px] tracking-widest uppercase inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2]" />
              <span>Replay Museum Exterior</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

