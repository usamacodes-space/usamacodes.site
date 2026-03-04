import { describe, expect, it } from 'vitest';
import {
  CONTACT_EMAIL,
  EDUCATION,
  EXPERIENCE,
  FAQ_ITEMS,
  PORTFOLIO_URL,
  PROJECTS,
  RESUME_URL,
  getPortfolioContextForAI,
} from './portfolio';

describe('portfolio data', () => {
  it('exports contact email', () => {
    expect(CONTACT_EMAIL).toBe('hello@usamacodes.space');
  });

  it('exports resume URL', () => {
    expect(RESUME_URL).toBe('/resume.pdf');
  });

  it('exports portfolio URL', () => {
    expect(PORTFOLIO_URL).toBe('https://usamacodes.space');
  });

  it('has at least one experience entry', () => {
    expect(EXPERIENCE.length).toBeGreaterThanOrEqual(1);
    expect(EXPERIENCE[0]).toHaveProperty('role');
    expect(EXPERIENCE[0]).toHaveProperty('company');
    expect(EXPERIENCE[0]).toHaveProperty('period');
    expect(Array.isArray(EXPERIENCE[0].highlights)).toBe(true);
  });

  it('has at least one education entry', () => {
    expect(EDUCATION.length).toBeGreaterThanOrEqual(1);
    expect(EDUCATION[0]).toHaveProperty('degree');
    expect(EDUCATION[0]).toHaveProperty('institution');
    expect(EDUCATION[0]).toHaveProperty('period');
  });

  it('has FAQ items', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(1);
    FAQ_ITEMS.forEach((faq) => {
      expect(faq).toHaveProperty('question');
      expect(faq).toHaveProperty('answer');
    });
  });

  it('has projects', () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(1);
    PROJECTS.forEach((p) => {
      expect(p).toHaveProperty('title');
      expect(p).toHaveProperty('description');
      expect(Array.isArray(p.tags)).toBe(true);
    });
  });

  it('getPortfolioContextForAI returns a string containing key data', () => {
    const context = getPortfolioContextForAI();
    expect(typeof context).toBe('string');
    expect(context.length).toBeGreaterThan(100);
    expect(context).toContain(CONTACT_EMAIL);
    expect(context).toContain(PORTFOLIO_URL);
    expect(context).toContain('Usama');
    FAQ_ITEMS.forEach((faq) => {
      expect(context).toContain(faq.question);
      expect(context).toContain(faq.answer);
    });
  });
});
