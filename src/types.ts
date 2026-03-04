export interface Project {
  title: string;
  description: string;
  tags: string[];
  icon?: string;
  sourceUrl?: string;
  demoUrl?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  /** e.g. "Current" for in-progress degree */
  badge?: string;
}
