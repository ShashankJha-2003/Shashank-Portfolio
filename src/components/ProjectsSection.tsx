'use client';

import React, { useState } from 'react';
import { ExternalLink, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types/portfolio';

export default function ProjectsSection() {
  const { data, playAudioCue } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Creative & 3D', 'Full-Stack', 'AI & Cloud'];

  const filteredProjects = selectedCategory === 'All'
    ? data.projects
    : data.projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#d6c7b2] uppercase mb-2">
              <span>[ 06 // FEATURED PROJECTS ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8]">
              Featured <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Creations</span>
            </h2>
            <p className="text-sm sm:text-base text-[#d5cec2] max-w-xl mt-2 font-normal">
              High-impact web architectures, interactive 3D WebGL experiences, and full-stack software products built with engineering precision.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0f1013] p-1.5 rounded-full border border-[#d6c7b2]/15">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playAudioCue('click');
                  setSelectedCategory(cat);
                }}
                onMouseEnter={() => playAudioCue('hover')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#d6c7b2] text-[#0f1013] font-bold shadow-[0_0_15px_rgba(214,199,178,0.25)]'
                    : 'text-[#d5cec2] hover:text-[#f5f0e8] hover:bg-[#161920]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              onMouseEnter={() => playAudioCue('hover')}
              className="glass-card rounded-2xl overflow-hidden border border-[#d6c7b2]/10 hover:border-[#d6c7b2]/40 flex flex-col justify-between group transition-all duration-300 relative bg-[#161920]/95 shadow-2xl"
            >
              {/* Image banner / Cover */}
              <div className="relative h-48 w-full overflow-hidden bg-[#0f1013]">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#0f1013] via-[#161920] to-[#d6c7b2]/15">
                    <Layers className="w-10 h-10 text-[#f5f0e8]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161920] via-transparent to-transparent opacity-90" />

                {/* Featured / Category tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide uppercase bg-[#0f1013]/85 backdrop-blur-md border border-[#d6c7b2]/15 text-[#f5f0e8] font-semibold">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-[#d6c7b2]/20 border border-[#d6c7b2]/40 text-[#f5f0e8] flex items-center gap-1 font-bold">
                      <Sparkles className="w-2.5 h-2.5 text-[#d6c7b2]" /> Featured
                    </span>
                  )}
                </div>

                {/* Live link quick icon */}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playAudioCue('click')}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0f1013]/80 backdrop-blur-md border border-[#d6c7b2]/20 flex items-center justify-center text-[#f5f0e8] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/60 transition-all cursor-pointer shadow-lg"
                    aria-label={`Open ${project.title} live preview`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors mb-2 flex items-center justify-between">
                    <span>{project.title}</span>
                  </h3>
                  <p className="text-xs text-[#d6c7b2] font-mono mb-3 leading-relaxed font-semibold">
                    {project.tagline}
                  </p>
                  <p className="text-sm text-[#d5cec2] mb-4 line-clamp-3 leading-relaxed font-normal">
                    {project.description}
                  </p>

                  {/* Metrics Badge */}
                  {project.metrics && (
                    <div className="mb-4 px-3 py-1.5 rounded-lg bg-[#1c202a] border border-[#d6c7b2]/25 text-[11px] font-mono text-[#d6c7b2] flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#d6c7b2]" />
                      <span>{project.metrics}</span>
                    </div>
                  )}
                </div>

                {/* Tech Tags and Footer Links */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-[#d6c7b2]/10">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0f1013] text-[#d5cec2] border border-[#d6c7b2]/15 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playAudioCue('click')}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#d5cec2] hover:text-[#d6c7b2] transition-colors cursor-pointer font-medium"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    ) : <div />}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playAudioCue('click')}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#d6c7b2] hover:underline cursor-pointer font-bold"
                      >
                        <span>Launch App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
