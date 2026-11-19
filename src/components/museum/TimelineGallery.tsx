'use client';

import React, { useState } from 'react';
import { Award, Briefcase, GraduationCap, ChevronDown, CheckCircle2, Sparkles, Cpu } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import MuseumRoomHeader from './MuseumRoomHeader';

interface TimelineChapter {
  number: string;
  title: string;
  organization: string;
  period: string;
  badge: string;
  summary: string;
  responsibilities: string[];
  artifacts: string[];
}

export default function TimelineGallery() {
  const { data, playAudioCue } = usePortfolio();
  const [expandedChapter, setExpandedChapter] = useState<string>('04');

  const chapters: TimelineChapter[] = [
    {
      number: '01',
      title: 'Academic Journey',
      organization: 'Parul University, Vadodara — B.Tech in Computer Science & Engineering',
      period: 'June 2022 – July 2026',
      badge: 'Foundation Chapter',
      summary:
        'Built deep engineering mastery across Data Structures & Algorithms, Core Java, Operating Systems, DBMS, Computer Networks, Theory of Computation, and Internet of Things.',
      responsibilities: [
        'Mastered algorithmic problem-solving, OOP principles in Java, and core computer science fundamentals.',
        'Completed NPTEL certifications through IIT Swayam in Theory of Computation and Internet of Things.',
        'Active participant in university developer communities, technical symposiums, and MERN stack workshops.',
      ],
      artifacts: ['Java', 'DSA', 'OS & DBMS', 'Theory of Computation', 'IoT'],
    },
    {
      number: '02',
      title: 'First Development Projects',
      organization: 'Independent Engineering Studio & TeachNook (IIT Roorkee)',
      period: '2023 – 2024',
      badge: 'Discovery Chapter',
      summary:
        'Stepped beyond theory into shipping interactive web interfaces, Python voice automation (J.A.R.V.I.S), and certified full-stack web engineering with TeachNook & IIT Roorkee.',
      responsibilities: [
        'Built the J.A.R.V.I.S desktop AI voice assistant in Python with SpeechRecognition, pyttsx3, and REST APIs.',
        'Completed Certified Web Development program in collaboration with IIT Roorkee and MERN Stack Workshop.',
        'Transitioned from static HTML/CSS layouts into modular JavaScript and component-driven UI design.',
      ],
      artifacts: ['HTML5 & CSS3', 'JavaScript', 'Python AI', 'MERN Workshop', 'REST APIs'],
    },
    {
      number: '03',
      title: 'CodSoft Internship',
      organization: 'CodSoft — Web Development Intern (Remote)',
      period: 'Jan 2025 – Feb 2025',
      badge: 'Industry Chapter',
      summary:
        'Engineered responsive full-stack web applications, interactive utility suites, and high-fidelity streaming UI clones while adopting production Git and API testing practices.',
      responsibilities: [
        'Developed responsive web applications using HTML5, CSS3, JavaScript, Node.js, and Express.js.',
        'Delivered a Personal Portfolio Website, Scientific Calculator Suite, and Netflix UI Clone.',
        'Practiced structured Git workflows, version control branching, and API debugging with Postman.',
      ],
      artifacts: ['Node.js', 'Express.js', 'JavaScript', 'Git', 'Postman'],
    },
    {
      number: '04',
      title: 'PRISMIO Internship',
      organization: 'PRISMIO — React Frontend Trainee (Remote)',
      period: 'Jan 2026 – March 2026',
      badge: '3D & Frontend Chapter',
      summary:
        'Spearheaded modern interactive interfaces, GSAP motion choreography, and Three.js 3D product showcases—culminating in the live launch of the Vertex Phone X1 prototype.',
      responsibilities: [
        'Crafted clean, high-craft responsive interfaces with React, Tailwind CSS, and modern ES6+ JavaScript.',
        'Engineered real-time 3D interactive product visualizations and ScrollTrigger timelines using Three.js and GSAP.',
        'Streamlined modern frontend builds with Vite and continuous production deployments on Vercel.',
      ],
      artifacts: ['React', 'Three.js', 'GSAP', 'Tailwind CSS', 'Vite', 'Vercel'],
    },
    {
      number: '05',
      title: 'Edugenius – Teaching & Robotics',
      organization: 'STEM Mentorship, IoT/Robotics Exploration & Technical Sharing',
      period: 'Ongoing Chapter',
      badge: 'Mentorship & Robotics',
      summary:
        'Bridging software engineering with hands-on teaching, robotics & IoT concepts, and mentoring peers through interactive tutorials on modern frontend and core computer science.',
      responsibilities: [
        'Guided students and junior developers on Git workflows, responsive CSS architecture, and interactive web engineering.',
        'Explored robotics & embedded IoT prototyping alongside practical programming fundamentals.',
        'Shared structured technical guides and real-world internship roadmaps to accelerate community learning.',
      ],
      artifacts: ['Teaching & Mentorship', 'Robotics & IoT', 'Technical Writing', 'Community Leadership'],
    },
  ];

  return (
    <section
      id="timeline-gallery"
      className="relative py-28 sm:py-36 px-4 sm:px-8 border-t border-[#d6c7b2]/10 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d6c7b2]/40 to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="04"
          wingLabel="TIMELINE GALLERY"
          title="The Illuminated"
          accentWord="Corridor"
          subtitle="Walk down the chronological hall of growth—five curated chapters tracing academic foundations, engineering internships, 3D frontend craft, and teaching."
        />

        {/* =============================================================== */}
        {/* ILLUMINATED CORRIDOR OF CHAPTERS                                */}
        {/* =============================================================== */}
        <div className="relative pl-6 sm:pl-12">
          {/* Illuminated Architectural Corridor Spine */}
          <div className="absolute left-2 sm:left-4 top-3 bottom-3 w-px bg-gradient-to-b from-[#d6c7b2]/70 via-[#d6c7b2]/25 to-transparent" />

          <div className="space-y-5">
            {chapters.map((chapter) => {
              const isOpen = expandedChapter === chapter.number;
              return (
                <div key={chapter.number} className="relative">
                  {/* Illuminated Corridor Wall Light Node */}
                  <div
                    className={`absolute -left-[22px] sm:-left-[39px] top-7 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      isOpen
                        ? 'border-[#ece3d4] bg-[#d6c7b2] shadow-[0_0_20px_rgba(214,199,178,0.85)] scale-110'
                        : 'border-[#d6c7b2]/45 bg-[#0f1013]'
                    }`}
                  />

                  <div
                    onClick={() => {
                      playAudioCue('click');
                      setExpandedChapter(isOpen ? '' : chapter.number);
                    }}
                    onMouseEnter={() => playAudioCue('hover')}
                    className={`rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isOpen
                        ? 'border-[#d6c7b2]/55 bg-[#171a23] shadow-[0_20px_55px_rgba(0,0,0,0.85),0_0_30px_rgba(214,199,178,0.1)]'
                        : 'border-[#d6c7b2]/14 bg-[#12141a]/90 hover:border-[#d6c7b2]/35'
                    }`}
                  >
                    {/* Chapter Wall Plaque Header */}
                    <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0f1013] border border-[#d6c7b2]/30 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[8px] font-mono tracking-widest uppercase text-[#8e877c]">
                            CH.
                          </span>
                          <span className="font-mono text-sm font-bold text-[#d6c7b2]">
                            {chapter.number}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#d6c7b2] font-semibold">
                              {chapter.period}
                            </span>
                            <span className="text-[#d6c7b2]/30">•</span>
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0f1013] border border-[#d6c7b2]/15 text-[#d5cec2]/80">
                              {chapter.badge}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#f5f0e8]">
                            {chapter.title}
                          </h3>
                          <p className="text-xs font-mono text-[#8e877c] mt-0.5">
                            {chapter.organization}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center text-[11px] font-mono uppercase tracking-wider text-[#d6c7b2]">
                        <span>{isOpen ? 'Close Dossier' : 'Inspect Chapter'}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Exhibition Details */}
                    {isOpen && (
                      <div className="px-6 sm:px-7 pb-7 pt-2 border-t border-[#d6c7b2]/12 space-y-5">
                        <p className="text-sm sm:text-base text-[#d5cec2] font-light leading-relaxed">
                          {chapter.summary}
                        </p>

                        <div className="space-y-2.5">
                          <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#8e877c]">
                            Key Responsibilities &amp; Milestones
                          </div>
                          {chapter.responsibilities.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm text-[#f5f0e8]/85 font-light">
                              <CheckCircle2 className="w-4 h-4 text-[#d6c7b2] shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#d6c7b2]/10">
                          {chapter.artifacts.map((art) => (
                            <span
                              key={art}
                              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0f1013] border border-[#d6c7b2]/20 text-[#d6c7b2]"
                            >
                              {art}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =============================================================== */}
        {/* HALL OF CREDENTIALS (Certifications & Workshops)                */}
        {/* =============================================================== */}
        {data.certifications && data.certifications.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-7">
              <Award className="w-4 h-4 text-[#d6c7b2]" />
              <span className="text-xs font-mono tracking-[0.22em] uppercase text-[#d6c7b2] font-semibold">
                Hall of Credentials — Certifications &amp; Workshops
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#d6c7b2]/25 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="museum-plaque rounded-2xl p-5 flex flex-col justify-between gap-3 hover:border-[#d6c7b2]/45 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#8e877c]">
                      CREDENTIAL 0{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#d6c7b2]/12 border border-[#d6c7b2]/25 text-[10px] font-mono text-[#d6c7b2] font-semibold">
                      {cert.year}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-[#f5f0e8] leading-snug mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-xs font-mono text-[#d5cec2]/65">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

