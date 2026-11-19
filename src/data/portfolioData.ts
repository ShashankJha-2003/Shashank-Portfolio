import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  personal: {
    name: "Shashank Jha",
    signatureText: "S. Jha",
    title: "Software & Web Developer | Three.js & Creative Frontend Specialist",
    tagline: "Crafting responsive, high-performance web applications and interactive 3D visual experiences using modern web technologies.",
    status: "Available for Software Engineering & Frontend Roles",
    about: "I am a passionate Software and Web Developer with hands-on experience in developing responsive and interactive web applications using modern frontend technologies. With practical experience across JavaScript, Tailwind CSS, Three.js, GSAP, and Vite, along with foundational backend knowledge in Node.js, Express.js, and REST APIs, I build digital experiences that combine performance with visual appeal. I also have a strong foundation in Java, Data Structures & Algorithms, and Python.",
    bioParagraphs: [
      "Currently pursuing B.Tech in Computer Science & Engineering at Parul University (2022–2026), my journey bridges core computer science principles with modern interactive web development.",
      "Having completed engineering roles as a React Frontend Trainee at PRISMIO and Web Development Intern at CodSoft, I specialize in building responsive user interfaces, fluid GSAP animations, 3D visual elements in Three.js, and scalable APIs."
    ],
    email: "aj8085769067@gmail.com",
    phone: "+91-8085769067",
    location: "Vadodara, Gujarat, India",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    twitter: "https://twitter.com",
    resumeUrl: "#resume-modal",
    stats: [
      {
        label: "B.Tech CSE",
        value: "2026",
        subtext: "Parul University, Vadodara"
      },
      {
        label: "Internships",
        value: "2+",
        subtext: "PRISMIO & CodSoft experience"
      },
      {
        label: "Projects Shipped",
        value: "10+",
        subtext: "3D Web, AI & Full-Stack Apps"
      },
      {
        label: "Certifications",
        value: "5+",
        subtext: "IIT Roorkee, NPTEL & Industry"
      }
    ]
  },
  skills: [
    {
      category: "Frontend & Interactive 3D",
      description: "Building responsive, modern, and animated web interfaces",
      skills: [
        { name: "React / Vite", level: 92, highlight: true },
        { name: "Three.js / WebGL", level: 88, highlight: true },
        { name: "GSAP Animations", level: 90, highlight: true },
        { name: "Tailwind CSS / CSS3", level: 95, highlight: true },
        { name: "JavaScript (ES6+)", level: 92, highlight: true },
        { name: "HTML5 & Semantic Web", level: 95 },
        { name: "Responsive UI Design", level: 94 }
      ]
    },
    {
      category: "Programming Languages & Core CS",
      description: "Algorithmic problem-solving and software engineering fundamentals",
      skills: [
        { name: "Java (Core & OOP)", level: 90, highlight: true },
        { name: "Data Structures & Algorithms", level: 86, highlight: true },
        { name: "Python", level: 85, highlight: true },
        { name: "C / C++ (Familiar)", level: 75 },
        { name: "Theory of Computation (TOC)", level: 82 }
      ]
    },
    {
      category: "Backend & Databases",
      description: "Server-side logic, API integrations, and database basics",
      skills: [
        { name: "Node.js & Express.js", level: 84, highlight: true },
        { name: "RESTful APIs", level: 88, highlight: true },
        { name: "MongoDB (Basics)", level: 78 },
        { name: "SQL (Familiar)", level: 75 },
        { name: "Postman API Testing", level: 85 }
      ]
    },
    {
      category: "Developer Tools & Platforms",
      description: "Modern workflows, version control, and cloud hosting",
      skills: [
        { name: "Git & GitHub", level: 90, highlight: true },
        { name: "Vercel Deployment", level: 92, highlight: true },
        { name: "VS Code", level: 95 },
        { name: "Vite Build Tool", level: 92 },
        { name: "Internet of Things (IoT)", level: 80 }
      ]
    }
  ],
  education: [
    {
      degree: "B. Tech in Computer Science & Engineering",
      institution: "Parul University, Vadodara",
      period: "June 2022 – July 2026",
      score: "Undergraduate (Pursuing)",
      highlights: [
        "Comprehensive curriculum in Data Structures, Algorithms, Operating Systems, Computer Networks, and DBMS",
        "Active member of developer clubs and tech symposiums",
        "Special focus on interactive frontend engineering, WebGL graphics, and full-stack software development",
        "Completed NPTEL certification in Theory of Computation and Internet of Things"
      ]
    }
  ],
  certifications: [
    {
      title: "Certified Web Development Course",
      issuer: "TeachNook (In collaboration with IIT Roorkee)",
      year: "2025"
    },
    {
      title: "Internship Completion Certificate (REACT Frontend Trainee)",
      issuer: "PRISMIO",
      year: "March 2026"
    },
    {
      title: "Internship Completion Certificate (Web Development)",
      issuer: "CodSoft",
      year: "Feb 2025"
    },
    {
      title: "NPTEL Course Completion (Theory of Computation & IoT)",
      issuer: "NPTEL / Swayam (IIT)",
      year: "2024"
    },
    {
      title: "MERN Stack Workshop Certificate",
      issuer: "Industry Workshop (MongoDB, Express, React, Node.js)",
      year: "2024"
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "REACT Frontend Trainee",
      company: "PRISMIO",
      location: "Remote / Internship",
      period: "Jan 2026 – March 2026",
      description: "Spearheaded the development of premium interactive web interfaces and dynamic animated components for client web projects.",
      achievements: [
        "Developed clean, responsive, and premium web interfaces using HTML, Tailwind CSS, and JavaScript.",
        "Implemented engaging interactive animations and visual 3D elements using GSAP and Three.js.",
        "Utilized Vite for modern frontend development and streamlined the rapid deployment workflow on Vercel."
      ],
      skills: ["React", "Three.js", "GSAP", "Tailwind CSS", "JavaScript", "Vite", "Vercel"]
    },
    {
      id: "exp-2",
      role: "Web Development Intern",
      company: "CodSoft",
      location: "Remote / Internship",
      period: "Jan 2025 – Feb 2025",
      description: "Built full-stack web applications, practical utility tools, and clone interfaces during an intensive development internship.",
      achievements: [
        "Developed responsive web applications using HTML, CSS, JavaScript, Node.js, and Express.js.",
        "Built a Portfolio Website, Calculator Website, and a Netflix UI Clone as part of the internship curriculum.",
        "Gained deep exposure to Git workflow, version control best practices, and API testing/debugging using Postman."
      ],
      skills: ["HTML5", "CSS3", "JavaScript", "Node.js", "Express.js", "Git", "Postman"]
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "VERTEX PHONE X1 - Mobile Prototype Website",
      tagline: "Mobile-focused 3D interactive showcase built with Three.js & GSAP",
      description: "Developed a mobile-focused, clean, responsive, and premium UI webpage featuring real-time interactive 3D product previews, fluid GSAP scroll animations, and dynamic transitions. Built with Vite and deployed live on Vercel as part of the PRISMIO internship.",
      category: "Creative & 3D",
      tags: ["Three.js", "GSAP", "Tailwind CSS", "JavaScript", "Vite", "Vercel"],
      metrics: "Live on Vercel • 60 FPS 3D animations • Mobile-first UI",
      githubUrl: "https://github.com",
      liveUrl: "https://vercel.com",
      featured: true,
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "project-2",
      title: "J.A.R.V.I.S - AI Voice Assistant",
      tagline: "Intelligent Python-based desktop voice assistant with speech synthesis",
      description: "Developed an intelligent Python voice assistant utilizing Text-to-Speech (pyttsx3) and Speech Recognition. Integrated external APIs to automate system tasks, browse the web, check telemetry, and process conversational voice commands with modular command-handling logic.",
      category: "AI & Cloud",
      tags: ["Python", "Speech Recognition", "Text-to-Speech", "REST APIs", "Automation"],
      metrics: "Sub-second speech recognition latency • Modular extensible architecture",
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: true,
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "project-3",
      title: "CodSoft Portfolio Web Application",
      tagline: "Responsive developer portfolio designed and built during CodSoft internship",
      description: "Designed and engineered a clean, responsive personal portfolio website showcasing web projects, technical skill proficiencies, and contact integration. Built with semantic HTML5, CSS3, and JavaScript.",
      category: "Full-Stack",
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "CodSoft"],
      metrics: "Built during CodSoft Internship • 100% responsive across mobile and desktop",
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: true,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "project-4",
      title: "Netflix UI Clone & Streaming Hub",
      tagline: "High-fidelity media catalog interface built during CodSoft internship",
      description: "Built a fully responsive Netflix UI Clone with movie preview banners, dynamic category carousels, responsive video modal overlays, and clean modern CSS styling.",
      category: "Full-Stack",
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git"],
      metrics: "Built during CodSoft Internship • 100% responsive across all screens",
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: false,
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "project-5",
      title: "Scientific Calculator & Utility Suite",
      tagline: "Precision algorithmic calculation application with modern interface",
      description: "Designed a clean, responsive scientific calculator web application with full keyboard accessibility, continuous equation evaluation, error-checking, and sleek UI aesthetics.",
      category: "Full-Stack",
      tags: ["JavaScript", "HTML5", "CSS3", "Algorithms"],
      metrics: "Instant evaluation • Zero external dependencies",
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: false,
      image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  journey: [
    {
      year: "2022",
      title: "Beginning the B.Tech CSE Journey",
      tagline: "Enrolled in Parul University, Vadodara",
      description: "Stepped into the world of Computer Science & Engineering. Mastered Core Java, Object-Oriented Programming, and laid a solid foundation in Data Structures & Algorithms.",
      icon: "🎓",
      category: "Education",
      skills: ["Java", "OOP", "Data Structures", "C/C++"]
    },
    {
      year: "2023",
      title: "Exploring Web Technologies & Python",
      tagline: "HTML5, CSS3, JavaScript & Automation",
      description: "Expanded horizons into web development and scripting. Built early interactive web pages, explored Python libraries for automation, and built algorithmic problem-solving skills.",
      icon: "⚡",
      category: "Origin",
      skills: ["HTML5", "CSS3", "JavaScript", "Python"]
    },
    {
      year: "2024",
      title: "NPTEL Certifications & MERN Workshop",
      tagline: "Deepening theoretical & practical engineering",
      description: "Completed NPTEL certifications in Theory of Computation (TOC) and Internet of Things (IoT). Attended comprehensive MERN stack workshop mastering MongoDB, Express, React, and Node.js.",
      icon: "📜",
      category: "Education",
      skills: ["Theory of Computation", "IoT", "MERN Stack", "React", "Node.js"]
    },
    {
      year: "2025",
      title: "CodSoft Web Development Internship",
      tagline: "Practical full-stack development & API testing",
      description: "Developed real-world web applications including a Portfolio, Calculator, and Netflix UI Clone. Gained rigorous Git workflow exposure and API testing skills with Postman.",
      icon: "💼",
      category: "Breakthrough",
      skills: ["CodSoft Internship", "Node.js", "Express.js", "Git", "Postman", "Responsive Web"]
    },
    {
      year: "2026",
      title: "PRISMIO React Frontend Trainee & 3D Web",
      tagline: "Three.js, GSAP & Vertex Phone X1 Launch",
      description: "Engineered cutting-edge interactive websites at PRISMIO. Built the Vertex Phone X1 3D prototype website using Three.js and GSAP, deploying high-performance apps with Vite on Vercel.",
      icon: "🚀",
      category: "Leadership",
      skills: ["PRISMIO Trainee", "Three.js", "GSAP", "Tailwind CSS", "Vite", "Vercel"]
    }
  ],
  hobbies: [
    {
      id: "hobby-1",
      title: "Interactive 3D Coding & WebGL Shaders",
      category: "Creative Technology",
      description: "Experimenting with Three.js particle systems, procedural LiDAR clouds, and GSAP camera fly-through choreography in the browser.",
      icon: "🌐",
      badge: "CREATIVE 3D",
      details: "Exploring WebGL, lighting models, and physics-based particle simulation."
    },
    {
      id: "hobby-2",
      title: "Python AI & Voice Automation",
      category: "Artificial Intelligence",
      description: "Building custom desktop voice bots, text-to-speech scripts, and API automation tools inspired by JARVIS.",
      icon: "🤖",
      badge: "AI AUTOMATION",
      details: "Automating repetitive PC workflows with speech synthesis and REST micro-endpoints."
    },
    {
      id: "hobby-3",
      title: "Competitive Problem Solving in Java",
      category: "Core Algorithms",
      description: "Tackling Data Structures & Algorithms challenges across arrays, binary trees, recursion, and dynamic programming.",
      icon: "☕",
      badge: "DSA & JAVA",
      details: "Practicing clean, optimized Java solutions for technical interviews and coding contests."
    },
    {
      id: "hobby-4",
      title: "Cricket & Team Sports",
      category: "Physical Fitness",
      description: "Playing competitive and casual cricket. Fosters sharp hand-eye coordination, team leadership, and tactical focus under pressure.",
      icon: "🏏",
      badge: "SPORTS",
      details: "Active college tournaments and weekend community cricket matches."
    },
    {
      id: "hobby-5",
      title: "Tech Reading & Exploring Open Source",
      category: "Continuous Learning",
      description: "Reading developer blogs, tracking Vite / Next.js ecosystem advancements, and exploring trending open-source GitHub repositories.",
      icon: "📚",
      badge: "DEV COMMUNITY",
      details: "Staying up-to-date with emerging frontend tools, libraries, and design patterns."
    },
    {
      id: "hobby-6",
      title: "Technical Writing & Knowledge Sharing",
      category: "Mentorship",
      description: "Documenting learnings, creating tutorials for peers on Git workflows, Tailwind CSS, and frontend animation tips.",
      icon: "✍",
      badge: "WRITING",
      details: "Helping fellow college engineering students navigate internships and web development."
    }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "Building the Vertex Phone X1 3D Prototype with Three.js and GSAP",
      slug: "vertex-phone-x1-threejs-gsap-prototype",
      excerpt: "How I built an interactive 3D mobile prototype website with responsive product rotation, smooth camera transitions, and Vite during my PRISMIO internship.",
      content: [
        "In modern web design, standard 2D imagery no longer satisfies users seeking interactive product understanding. At PRISMIO, I was tasked with building a premium mobile showcase.",
        "Using Three.js, we loaded and rendered the 3D phone prototype with realistic ambient lighting and metallic specular reflections.",
        "Coupling the 3D scene with GSAP ScrollTrigger allowed user scroll gestures to choreograph rotation, camera zoom, and floating spec callouts, achieving a smooth 60 FPS experience on Vercel."
      ],
      date: "March 2026",
      readTime: "5 min read",
      category: "3D & WebGL",
      tags: ["Three.js", "GSAP", "Tailwind CSS", "Vite", "PRISMIO"],
      featured: true
    },
    {
      id: "blog-2",
      title: "From College to First Internships: My Journey at CodSoft and PRISMIO",
      slug: "journey-codsoft-to-prismio-internship",
      excerpt: "Key lessons learned stepping out of the classroom into real-world software engineering, Git version control, Postman API testing, and production deployments.",
      content: [
        "Transitioning from theoretical computer science courses at Parul University to real-world codebases was an eye-opening milestone in my career.",
        "At CodSoft, building the Portfolio, Calculator, and Netflix clone taught me the discipline of component hierarchy, Git commits, and debugging APIs with Postman.",
        "At PRISMIO, working as a React Frontend Trainee elevated my standards for UI polish, animation curves, and modern tooling with Vite."
      ],
      date: "Feb 2026",
      readTime: "6 min read",
      category: "Career & Growth",
      tags: ["Internship", "Career", "React", "Git", "College"],
      featured: true
    },
    {
      id: "blog-3",
      title: "Developing J.A.R.V.I.S: Building an Extensible Python Voice Assistant",
      slug: "developing-jarvis-python-voice-assistant",
      excerpt: "Step-by-step breakdown of combining SpeechRecognition, pyttsx3, and modular API handlers to create an intelligent desktop assistant.",
      content: [
        "Voice interfaces represent a natural evolution in human-computer interaction. Inspired by iron suit AI, I set out to build J.A.R.V.I.S in Python.",
        "The project handles continuous audio listening, ambient noise calibration, and speech-to-text conversion.",
        "A modular command registry enables simple integration of new capabilities like weather forecasts, Wikipedia lookups, system controls, and web launches."
      ],
      date: "Jan 2026",
      readTime: "7 min read",
      category: "Python & AI",
      tags: ["Python", "Voice Assistant", "Speech Recognition", "Automation"],
      featured: false
    },
    {
      id: "blog-4",
      title: "Demystifying Core Data Structures in Java: A College Student's Guide",
      slug: "core-data-structures-in-java-guide",
      excerpt: "Essential tips, memory trade-offs, and algorithmic patterns for mastering arrays, linked lists, trees, and maps in Java.",
      content: [
        "Understanding Data Structures and Algorithms is the cornerstone of any strong computer science education.",
        "In this guide, I share how visualizing memory allocation in Java helps demystify pointers, references, and complexity analysis (Big-O).",
        "We also cover recurring patterns like Two Pointers, Sliding Window, and BFS/DFS traversal that appear frequently in technical coding rounds."
      ],
      date: "Dec 2025",
      readTime: "8 min read",
      category: "Java & DSA",
      tags: ["Java", "DSA", "Algorithms", "Parul University"],
      featured: false
    }
  ]
};
