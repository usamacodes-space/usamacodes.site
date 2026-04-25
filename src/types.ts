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

/** Small shipped ideas with public URLs (Indie Page–style list). */
export interface FunBuild {
  /** Stable identifier used for admin CRUD. */
  id?: string;
  title: string;
  description: string;
  url: string;
  /** Optional second link (e.g. GitHub repo or tree when `url` points at a README). */
  githubUrl?: string;
  /** Optional thumbnail/screenshot URL shown in the public list. */
  imageUrl?: string;
  /** Shown in the tile — emoji or a single character */
  emoji?: string;
  status?: 'live' | 'wip' | 'idea';

  /** Optional fields for internal testing (admin-only; not shown publicly). */
  demoUsername?: string;
  demoPassword?: string;
  demoNotes?: string;

  /** ISO timestamps (admin-only metadata). */
  createdAt?: string;
  updatedAt?: string;
}
