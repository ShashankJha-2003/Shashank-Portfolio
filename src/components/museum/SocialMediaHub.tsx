'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Pencil, Check, X, Link2, Sparkles } from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
  GithubIcon,
  LinkedinIcon,
} from '../SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';

interface SocialMediaHubProps {
  compact?: boolean;
}

interface SocialPlatformItem {
  key: 'instagram' | 'facebook' | 'pinterest' | 'github' | 'linkedin';
  name: string;
  tagline: string;
  placeholder: string;
  accent: string;
  bgTint: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const PLATFORMS: SocialPlatformItem[] = [
  {
    key: 'instagram',
    name: 'Instagram',
    tagline: 'Visual Stories & Reels',
    placeholder: 'https://instagram.com/yourhandle',
    accent: '#E1306C',
    bgTint: 'rgba(225, 48, 108, 0.14)',
    Icon: InstagramIcon,
  },
  {
    key: 'facebook',
    name: 'Facebook',
    tagline: 'Community & Updates',
    placeholder: 'https://facebook.com/yourprofile',
    accent: '#1877F2',
    bgTint: 'rgba(24, 119, 242, 0.14)',
    Icon: FacebookIcon,
  },
  {
    key: 'pinterest',
    name: 'Pinterest',
    tagline: 'Design Boards & Inspiration',
    placeholder: 'https://pinterest.com/yourhandle',
    accent: '#E60023',
    bgTint: 'rgba(230, 0, 35, 0.14)',
    Icon: PinterestIcon,
  },
  {
    key: 'github',
    name: 'GitHub',
    tagline: 'Open-Source Code & Repos',
    placeholder: 'https://github.com/yourusername',
    accent: '#d6c7b2',
    bgTint: 'rgba(214, 199, 178, 0.14)',
    Icon: GithubIcon,
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    tagline: 'Career & Engineering Network',
    placeholder: 'https://linkedin.com/in/yourprofile',
    accent: '#0A66C2',
    bgTint: 'rgba(10, 102, 194, 0.15)',
    Icon: LinkedinIcon,
  },
];

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatHandle(url?: string): string {
  if (!url) return 'Not connected yet';
  try {
    const cleaned = url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
    return cleaned.length > 26 ? `${cleaned.slice(0, 26)}…` : cleaned;
  } catch {
    return url;
  }
}

export default function SocialMediaHub({ compact = false }: SocialMediaHubProps) {
  const { data, updateData, playAudioCue } = usePortfolio();
  const [editing, setEditing] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [draft, setDraft] = useState({
    instagram: data.personal.instagram || 'https://instagram.com',
    facebook: data.personal.facebook || 'https://facebook.com',
    pinterest: data.personal.pinterest || 'https://pinterest.com',
    github: data.personal.github || 'https://github.com',
    linkedin: data.personal.linkedin || 'https://linkedin.com',
  });

  useEffect(() => {
    setDraft({
      instagram: data.personal.instagram || 'https://instagram.com',
      facebook: data.personal.facebook || 'https://facebook.com',
      pinterest: data.personal.pinterest || 'https://pinterest.com',
      github: data.personal.github || 'https://github.com',
      linkedin: data.personal.linkedin || 'https://linkedin.com',
    });
  }, [data.personal]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioCue('whoosh');
    updateData({
      ...data,
      personal: {
        ...data.personal,
        instagram: normalizeUrl(draft.instagram) || 'https://instagram.com',
        facebook: normalizeUrl(draft.facebook) || 'https://facebook.com',
        pinterest: normalizeUrl(draft.pinterest) || 'https://pinterest.com',
        github: normalizeUrl(draft.github) || 'https://github.com',
        linkedin: normalizeUrl(draft.linkedin) || 'https://linkedin.com',
      },
    });
    setEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2600);
  };

  return (
    <div className="space-y-4">
      {/* Header Row with Connect / Edit Links Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#f4a8c4]" />
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#f4a8c4] font-bold">
            Social Media Channels ({PLATFORMS.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {savedToast && (
            <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3 h-3" /> Links Connected!
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setEditing((prev) => !prev);
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
              editing
                ? 'bg-white/10 border-white/25 text-[#f5f0e8]'
                : 'bg-[#f4a8c4]/12 border-[#f4a8c4]/40 text-[#f4a8c4] hover:bg-[#f4a8c4] hover:text-[#0f1013] font-semibold'
            }`}
          >
            {editing ? (
              <>
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Pencil className="w-3 h-3" />
                <span>Connect / Edit Links</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline Editor to Paste & Save Real Social URLs */}
      {editing ? (
        <form
          onSubmit={handleSave}
          className="rounded-2xl bg-[#0c0e14] border border-[#f4a8c4]/30 p-4 space-y-3 animate-in fade-in duration-200"
        >
          <div className="text-[11px] font-mono text-[#d5cec2]/80 flex items-center gap-1.5 mb-1">
            <Link2 className="w-3.5 h-3.5 text-[#f4a8c4]" />
            <span>Paste your profile URLs below — saved automatically to your portfolio:</span>
          </div>
          <div className={compact ? 'space-y-2.5' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
            {PLATFORMS.map((p) => {
              const Icon = p.Icon;
              return (
                <label key={p.key} className="block space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5" style={{ color: p.accent }}>
                    <Icon className="w-3 h-3" />
                    {p.name}
                  </span>
                  <input
                    type="text"
                    value={draft[p.key]}
                    onChange={(e) => setDraft({ ...draft, [p.key]: e.target.value })}
                    placeholder={p.placeholder}
                    className="w-full px-3 py-2 rounded-xl bg-[#131620] border border-white/15 text-xs font-mono text-[#f5f0e8] placeholder-[#6e6a63] focus:outline-none focus:border-[#f4a8c4]"
                  />
                </label>
              );
            })}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f4a8c4] via-[#f7c6d9] to-[#d6c7b2] text-[#0f1013] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save &amp; Connect Social Links</span>
          </button>
        </form>
      ) : (
        /* Luxury Social Media Cards Grid */
        <div
          className={
            compact
              ? 'grid grid-cols-1 gap-2'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5'
          }
        >
          {PLATFORMS.map((p) => {
            const Icon = p.Icon;
            const url = data.personal[p.key] || `https://${p.key}.com`;
            return (
              <a
                key={p.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playAudioCue('click')}
                onMouseEnter={() => playAudioCue('hover')}
                className={`group relative rounded-2xl border border-[#d6c7b2]/18 bg-[#101219]/92 hover:border-white/40 transition-all duration-300 overflow-hidden ${
                  compact
                    ? 'px-3.5 py-2.5 flex items-center justify-between gap-3 hover:translate-x-0.5'
                    : 'p-4.5 flex flex-col justify-between gap-4 hover:-translate-y-1'
                }`}
              >
                <div className={compact ? 'flex items-center gap-3 min-w-0' : 'flex items-center justify-between'}>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 border"
                    style={{
                      backgroundColor: p.bgTint,
                      borderColor: `${p.accent}55`,
                      color: p.accent,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {compact ? (
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#f5f0e8] group-hover:text-white flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-[9px] font-mono opacity-60 font-normal hidden sm:inline">
                          • {p.tagline}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#8e877c] truncate">{formatHandle(url)}</div>
                    </div>
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-[#8e877c] group-hover:text-[#f5f0e8] transition-colors" />
                  )}
                </div>

                {compact ? (
                  <ExternalLink className="w-3.5 h-3.5 text-[#8e877c] group-hover:text-[#f5f0e8] shrink-0" />
                ) : (
                  <div>
                    <div className="font-serif text-xl text-[#f5f0e8] group-hover:text-white transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider mt-0.5" style={{ color: p.accent }}>
                      {p.tagline}
                    </div>
                    <div className="text-[10px] font-mono text-[#8e877c] truncate mt-1.5">{formatHandle(url)}</div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

