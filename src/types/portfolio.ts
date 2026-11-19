export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Full-Stack' | 'Creative & 3D' | 'AI & Cloud' | 'Mobile';
  tags: string[];
  metrics?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  image?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    level: number; // 1-100
    icon?: string;
    highlight?: boolean;
  }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  score?: string;
  highlights?: string[];
}

export interface JourneyMilestone {
  year: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  category: 'Origin' | 'Education' | 'Breakthrough' | 'Leadership';
  skills?: string[];
}

export interface Hobby {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
  details?: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

export interface PortfolioData {
  personal: {
    name: string;
    signatureText: string;
    title: string;
    tagline: string;
    status: string;
    about: string;
    bioParagraphs: string[];
    email: string;
    phone?: string;
    location: string;
    github: string;
    linkedin: string;
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    twitter?: string;
    resumeUrl: string;
    stats: {
      label: string;
      value: string;
      subtext: string;
    }[];
  };
  skills: SkillCategory[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  journey?: JourneyMilestone[];
  hobbies?: Hobby[];
  blogs?: BlogPost[];
  certifications?: {
    title: string;
    issuer: string;
    year: string;
    credentialUrl?: string;
  }[];
}
