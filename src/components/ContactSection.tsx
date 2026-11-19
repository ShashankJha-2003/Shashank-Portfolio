'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';

export default function ContactSection() {
  const { data, playAudioCue } = usePortfolio();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    playAudioCue('click');
    navigator.clipboard.writeText(data.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    playAudioCue('click');
    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      playAudioCue('whoosh');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#d6c7b2] uppercase mb-2">
            <span>[ 08 // CONTACT & SOCIALS ]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8]">
            Initiate <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Collaboration</span>
          </h2>
          <p className="text-sm sm:text-base text-[#d5cec2] max-w-xl mt-2 font-normal">
            Have a full-time role, internship opportunity, or technical project in mind? Let&apos;s build something extraordinary together.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-7 rounded-2xl border border-[#d6c7b2]/10 space-y-6 bg-[#161920]/95 shadow-2xl">
              <div>
                <h3 className="text-xl font-bold text-[#f5f0e8] mb-2">Get in Touch Directly</h3>
                <p className="text-sm text-[#d5cec2] font-normal leading-relaxed">
                  I typically respond within 24 hours. Feel free to reach out via email, phone, or connect on verified networks.
                </p>
              </div>

              {/* Email with copy button */}
              <div className="p-4 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/10 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1c202a] border border-[#d6c7b2]/30 flex items-center justify-center text-[#d6c7b2]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#8e877c] uppercase tracking-wider">Email Address</div>
                    <div className="text-sm font-mono text-[#f5f0e8] font-medium">{data.personal.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-[#f5f0e8]/5 hover:bg-[#d6c7b2] hover:text-[#0f1013] text-[#d5cec2] transition-all cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#d6c7b2]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location & Status */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#d5cec2]">
                  <MapPin className="w-4 h-4 text-[#d6c7b2] shrink-0" />
                  <span className="font-medium">{data.personal.location}</span>
                </div>
                {data.personal.phone && (
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-[#d5cec2]">
                    <Phone className="w-4 h-4 text-[#d6c7b2] shrink-0" />
                    <span className="font-medium">{data.personal.phone}</span>
                  </div>
                )}
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-[#d6c7b2]/10">
                <div className="text-xs font-mono text-[#f5f0e8]/90 mb-3 uppercase tracking-wider font-semibold">Verified Networks</div>
                <div className="flex items-center gap-2">
                  {data.personal.github && (
                    <a
                      href={data.personal.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/40 hover:scale-105 transition-all cursor-pointer shadow-md"
                      aria-label="GitHub Profile"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {data.personal.linkedin && (
                    <a
                      href={data.personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/40 hover:scale-105 transition-all cursor-pointer shadow-md"
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                  {data.personal.twitter && (
                    <a
                      href={data.personal.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/40 hover:scale-105 transition-all cursor-pointer shadow-md"
                      aria-label="Twitter Profile"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-7 sm:p-9 rounded-2xl border border-[#d6c7b2]/10 shadow-2xl relative bg-[#161920]/95">
              <h3 className="text-xl font-bold text-[#f5f0e8] mb-2">Send an Interactive Dispatch</h3>
              <p className="text-xs sm:text-sm text-[#d5cec2] mb-6 font-normal">
                Fill out the transmission form below to send an immediate inquiry.
              </p>

              {isSubmitted ? (
                <div className="py-12 px-6 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#1c202a] border border-[#d6c7b2]/40 flex items-center justify-center mx-auto text-[#d6c7b2] shadow-[0_0_25px_rgba(214,199,178,0.2)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#f5f0e8]">Transmission Delivered</h4>
                  <p className="text-sm text-[#d5cec2] max-w-md mx-auto font-normal">
                    Thank you! Your dispatch has been received. I look forward to reviewing your message and connecting soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#d5cec2] mb-1.5 uppercase tracking-wider font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] focus:ring-1 focus:ring-[#d6c7b2] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#d5cec2] mb-1.5 uppercase tracking-wider font-semibold">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] focus:ring-1 focus:ring-[#d6c7b2] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#d5cec2] mb-1.5 uppercase tracking-wider font-semibold">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Project Inquiry / Role Discussion"
                      className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] focus:ring-1 focus:ring-[#d6c7b2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#d5cec2] mb-1.5 uppercase tracking-wider font-semibold">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe the opportunity, timeline, and architectural requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8] placeholder-[#8e877c] text-sm focus:outline-none focus:border-[#d6c7b2] focus:ring-1 focus:ring-[#d6c7b2] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => playAudioCue('hover')}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e2d5c3] via-[#ece3d4] to-[#c8b79b] text-[#0f1013] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(214,199,178,0.25)] hover:shadow-[0_0_35px_rgba(214,199,178,0.45)] transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#0f1013] border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
