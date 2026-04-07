import { BrainCircuit, Briefcase, Cpu, FolderOpen, Github, Globe, GraduationCap, HelpCircle, Layout, LayoutGrid, Linkedin, Mail, Rocket, Sparkles, Twitter, User } from 'lucide-react';
import {
  EDUCATION as EDU_RAW,
  EXPERIENCE as EXP_RAW,
  FAQ_ITEMS as FAQ_RAW,
  FUN_BUILDS as FUN_BUILDS_RAW,
  PORTFOLIO_URL,
  PROJECTS as PROJECTS_RAW,
} from './data/portfolio';
import { Project } from './types';

export { CONTACT_EMAIL, RESUME_CONTENT, RESUME_URL } from './data/portfolio';
export const FAQ_ITEMS = FAQ_RAW;
export const FUN_BUILDS = FUN_BUILDS_RAW;
export const PROJECTS: Project[] = PROJECTS_RAW;
export const EXPERIENCE = EXP_RAW;
export const EDUCATION = EDU_RAW;

export const CAPABILITIES = [
  { title: "Project Showcase", description: "View my latest work", prompt: "Tell me about your projects and latest work.", icon: <Layout className="w-6 h-6 text-[#f97316]" /> },
  { title: "Technical Stack", description: "Tools and technologies", prompt: "What technologies and tools do you use?", icon: <Cpu className="w-6 h-6 text-[#f97316]" /> },
  { title: "AI Solutions", description: "Custom LLM builds", prompt: "Tell me about your AI and LLM experience.", icon: <BrainCircuit className="w-6 h-6 text-[#f97316]" /> },
  { title: "Contact Me", description: "Let's collaborate", prompt: "How can I contact you or collaborate?", icon: <Mail className="w-6 h-6 text-[#f97316]" /> },
];

export const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com/usamacodes-space', icon: <Github className="w-5 h-5" /> },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/usamacodes-space', icon: <Linkedin className="w-5 h-5" /> },
  { label: 'Twitter', url: 'https://twitter.com/usama_codes', icon: <Twitter className="w-5 h-5" /> },
  { label: 'Portfolio', url: PORTFOLIO_URL, icon: <Globe className="w-5 h-5" /> },
];

export const NAV_ITEMS = [
  { id: 'start', label: 'Start', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'fun', label: 'For fun', icon: <Rocket className="w-4 h-4" /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
];
