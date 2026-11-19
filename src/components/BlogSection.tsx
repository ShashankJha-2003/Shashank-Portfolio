'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { BookOpen, Calendar, Clock, ArrowRight, X, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { BlogPost } from '../types/portfolio';

export default function BlogSection() {
  const { data, playAudioCue } = usePortfolio();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogs = data.blogs || [];

  return (
    <section id="blog" className="relative py-28 px-4 sm:px-8 border-t border-[#d6c7b2]/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] text-xs font-mono tracking-widest uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles & Technical Notes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f5f0e8] mb-6">
            Technical <span className="bg-gradient-to-r from-[#f5f0e8] via-[#d6c7b2] to-[#a39783] bg-clip-text text-transparent">Blog</span>
          </h2>
          <p className="text-base sm:text-lg text-[#d5cec2] font-light leading-relaxed">
            Thoughts, technical retrospectives, and practical guides on Three.js 3D development, Python voice AI, internship learnings, and Data Structures in Java.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                playAudioCue('pageFlip');
                setSelectedPost(post);
              }}
              onMouseEnter={() => playAudioCue('hover')}
              className="group relative p-7 sm:p-9 rounded-2xl border border-[#d6c7b2]/10 bg-[#161920]/85 backdrop-blur-xl hover:border-[#d6c7b2]/40 hover:bg-[#1a1e27] transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs font-mono text-[#8e877c] mb-4">
                  <span className="px-2.5 py-0.5 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] tracking-wider font-semibold">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#d6c7b2]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1 text-[#8e877c]">
                      <Clock className="w-3.5 h-3.5 text-[#d6c7b2]" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[#d5cec2] leading-relaxed font-light mb-6">
                  {post.excerpt}
                </p>
              </div>

              {/* Tags & Action Link */}
              <div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#d6c7b2]/10 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0f1013] text-[#d5cec2] border border-[#d6c7b2]/15 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#d6c7b2] group-hover:text-[#f5f0e8] group-hover:translate-x-1 transition-all">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[#d6c7b2]/20 bg-[#161920] p-6 sm:p-10 shadow-2xl text-left">
            {/* Close Button */}
            <button
              onClick={() => {
                playAudioCue('click');
                setSelectedPost(null);
              }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#d6c7b2]/20 bg-[#0f1013] hover:bg-[#d6c7b2] hover:text-[#0f1013] flex items-center justify-center text-[#d5cec2] transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Post Header */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#8e877c] mb-4">
              <span className="px-3 py-1 rounded-full border border-[#d6c7b2]/30 bg-[#d6c7b2]/10 text-[#d6c7b2] tracking-wider font-semibold">
                {selectedPost.category}
              </span>
              <span>{selectedPost.date}</span>
              <span>•</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f5f0e8] tracking-tight leading-tight mb-6">
              {selectedPost.title}
            </h2>

            {/* Author Byline */}
            <div className="flex items-center gap-3 pb-6 border-b border-[#d6c7b2]/10 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d6c7b2] to-[#8e877c] p-[1.5px]">
                <div className="w-full h-full rounded-full bg-[#0f1013] flex items-center justify-center text-xs font-bold font-mono text-[#d6c7b2]">
                  SJ
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-[#f5f0e8] block">
                  {data.personal.name}
                </span>
                <span className="text-xs font-mono text-[#d6c7b2]">
                  {data.personal.title}
                </span>
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-base text-[#d5cec2] leading-relaxed font-light">
              {selectedPost.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Tags Footer */}
            <div className="mt-10 pt-6 border-t border-[#d6c7b2]/10 flex flex-wrap gap-2">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-3 py-1 rounded-md bg-[#0f1013] text-[#d5cec2] border border-[#d6c7b2]/15"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
