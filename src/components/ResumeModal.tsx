'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Sparkles, Check, RotateCcw, Edit3, Eye } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function ResumeModal() {
  const { data, updateData, resetData, isResumeModalOpen, setResumeModalOpen, playAudioCue } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [editJson, setEditJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isResumeModalOpen) {
      setEditJson(JSON.stringify(data, null, 2));
      setJsonError(null);
    }
  }, [isResumeModalOpen, data]);

  if (!isResumeModalOpen) return null;

  const handlePrint = () => {
    playAudioCue('click');
    window.print();
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(editJson);
      updateData(parsed);
      setJsonError(null);
      setIsSaved(true);
      playAudioCue('click');
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setJsonError(error.message || 'Invalid JSON format');
    }
  };

  const handleReset = () => {
    if (confirm('Reset portfolio resume data to default demo profile?')) {
      resetData();
      playAudioCue('click');
      setEditJson(JSON.stringify(data, null, 2));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#161920] border border-[#d6c7b2]/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d6c7b2]/10 bg-[#0f1013]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#d6c7b2] to-[#8e877c] p-[1.5px]">
              <div className="w-full h-full rounded-lg bg-[#0f1013] flex items-center justify-center font-mono font-bold text-xs text-[#d6c7b2]">
                CV
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f5f0e8] flex items-center gap-2">
                <span>{data.personal.name} — Curriculum Vitae</span>
              </h3>
              <p className="text-xs font-mono text-[#d6c7b2]">{data.personal.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View / Edit Mode Toggle */}
            <div className="flex items-center bg-[#0f1013] p-1 rounded-lg border border-[#d6c7b2]/10 mr-2">
              <button
                onClick={() => {
                  playAudioCue('click');
                  setActiveTab('view');
                }}
                className={`px-3 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'view' ? 'bg-[#d6c7b2] text-[#0f1013] font-bold' : 'text-[#d5cec2]/70 hover:text-[#f5f0e8]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Formatted CV</span>
              </button>
              <button
                onClick={() => {
                  playAudioCue('click');
                  setActiveTab('edit');
                }}
                className={`px-3 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'edit' ? 'bg-[#d6c7b2] text-[#0f1013] font-bold' : 'text-[#d5cec2]/70 hover:text-[#f5f0e8]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit / Paste Data</span>
              </button>
            </div>

            {activeTab === 'view' && (
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d6c7b2]/15 bg-[#f5f0e8]/5 hover:bg-[#f5f0e8]/10 text-[#f5f0e8] text-xs font-mono transition-all cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            )}

            <button
              onClick={() => {
                playAudioCue('click');
                setResumeModalOpen(false);
              }}
              className="p-2 rounded-lg bg-[#f5f0e8]/5 hover:bg-[#f5f0e8]/10 text-[#d5cec2] hover:text-[#f5f0e8] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#0f1013]/90">
          {activeTab === 'view' ? (
            /* Formatted CV View */
            <div className="max-w-3xl mx-auto space-y-8 text-[#d5cec2] font-sans print:text-black print:bg-white print:p-0">
              {/* CV Header */}
              <div className="border-b border-[#d6c7b2]/10 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#f5f0e8]">{data.personal.name}</h1>
                <p className="text-base text-[#d6c7b2] font-medium mt-1">{data.personal.title}</p>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-[#8e877c] mt-3">
                  <span>{data.personal.email}</span>
                  <span>•</span>
                  <span>{data.personal.location}</span>
                  {data.personal.phone && (
                    <>
                      <span>•</span>
                      <span>{data.personal.phone}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#d6c7b2] mb-2 font-bold">
                  [ Professional Summary ]
                </h2>
                <p className="text-sm text-[#d5cec2] leading-relaxed font-light">{data.personal.about}</p>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#d6c7b2] mb-4 font-bold">
                  [ Work Experience ]
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="font-bold text-base text-[#f5f0e8]">{exp.role}</div>
                        <div className="text-xs font-mono text-[#8e877c]">{exp.period}</div>
                      </div>
                      <div className="text-xs font-semibold text-[#d6c7b2]">{exp.company} — {exp.location}</div>
                      <p className="text-xs text-[#d5cec2]/80 leading-relaxed font-light">{exp.description}</p>
                      <ul className="text-xs text-[#d5cec2] space-y-1 list-disc list-inside">
                        {exp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Projects */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#d6c7b2] mb-4 font-bold">
                  [ Key Architectural Projects ]
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.projects.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-[#161920] border border-[#d6c7b2]/10 space-y-1.5">
                      <div className="font-bold text-sm text-[#f5f0e8]">{p.title}</div>
                      <div className="text-[11px] text-[#d6c7b2] font-mono">{p.category}</div>
                      <p className="text-xs text-[#d5cec2]/70 line-clamp-2">{p.description}</p>
                      <div className="text-[10px] font-mono text-[#8e877c] pt-1">
                        {p.tags.slice(0, 4).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Overview */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#d6c7b2] mb-3 font-bold">
                  [ Technical Proficiencies ]
                </h2>
                <div className="space-y-3">
                  {data.skills.map((cat, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-semibold text-[#f5f0e8]">{cat.category}: </span>
                      <span className="text-[#d5cec2] font-mono">
                        {cat.skills.map(s => s.name).join(' • ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#d6c7b2] mb-3 font-bold">
                  [ Education & Credentials ]
                </h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <div className="font-bold text-[#f5f0e8]">{edu.degree}</div>
                    <div className="text-[#d5cec2]/80">{edu.institution} ({edu.period}) • {edu.score}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Live JSON Editor / Quick Updater */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#f5f0e8]">Live Data Editor</h4>
                  <p className="text-xs text-[#d5cec2]/70 font-light">
                    You can paste your resume data directly into this JSON or modify values. Any changes immediately update the entire portfolio and are saved in browser storage.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>

              {jsonError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
                  Syntax Error: {jsonError}
                </div>
              )}

              {isSaved && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Portfolio state updated successfully!</span>
                </div>
              )}

              <div className="relative">
                <textarea
                  value={editJson}
                  onChange={(e) => setEditJson(e.target.value)}
                  rows={20}
                  className="w-full p-4 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/15 font-mono text-xs text-[#d6c7b2] focus:outline-none focus:border-[#d6c7b2] leading-relaxed resize-y selection:bg-[#d6c7b2]/30"
                  spellCheck={false}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSaveJson}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e2d5c3] via-[#ece3d4] to-[#c8b79b] text-[#0f1013] font-bold text-xs font-mono hover:shadow-[0_0_20px_rgba(214,199,178,0.35)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Changes Live</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
