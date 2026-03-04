import { describe, expect, it } from 'vitest';
import { queryPortfolio } from './chat';

describe('chat service (rule-based when offline)', () => {
  it('returns a string answer when offline', async () => {
    const result = await queryPortfolio('What is your tech stack?', false);
    expect(result.source).toBe('rule');
    expect(result.error).toBe(false);
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('returns answer for who are you / about', async () => {
    const result = await queryPortfolio('Who are you?', false);
    expect(result.source).toBe('rule');
    expect(result.text).toMatch(/Usama|Backend|Engineer/i);
  });

  it('returns answer for any question when offline', async () => {
    const result = await queryPortfolio('contact email', false);
    expect(result.source).toBe('rule');
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('returns answer for experience question', async () => {
    const result = await queryPortfolio('What is your work experience?', false);
    expect(result.source).toBe('rule');
    expect(result.text).toMatch(/FBM|NestJS|Software|Backend/i);
  });

  it('returns non-empty answer for education-themed question', async () => {
    const result = await queryPortfolio('education degree university', false);
    expect(result.source).toBe('rule');
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('returns ChatResult shape', async () => {
    const result = await queryPortfolio('skills', false);
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('source');
    expect(['api', 'rule']).toContain(result.source);
  });
});
