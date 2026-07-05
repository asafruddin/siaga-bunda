import { describe, expect, it } from 'vitest';
import { normalizeNumericInput } from './normalize-numeric-input';

describe('normalizeNumericInput', () => {
  it('allows a lone zero', () => {
    expect(normalizeNumericInput('0')).toBe('0');
    expect(normalizeNumericInput('00')).toBe('0');
  });

  it('replaces zero when typing another digit', () => {
    expect(normalizeNumericInput('05')).toBe('5');
    expect(normalizeNumericInput('01')).toBe('1');
  });

  it('removes leading zeros from longer values', () => {
    expect(normalizeNumericInput('007')).toBe('7');
    expect(normalizeNumericInput('12')).toBe('12');
  });

  it('strips non-digits', () => {
    expect(normalizeNumericInput('1a2')).toBe('12');
  });

  it('returns empty for cleared input', () => {
    expect(normalizeNumericInput('')).toBe('');
  });
});
