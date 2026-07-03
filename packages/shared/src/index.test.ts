import { describe, expect, it } from 'vitest';
import {
  calculateHpl,
  calculatePregnancyWeeks,
  registrationSchema,
  score,
} from './index';
describe('domain rules', () => {
  it('calculates HPL at 280 days', () =>
    expect(calculateHpl('2026-01-01')).toBe('2026-10-08'));
  it('calculates whole pregnancy weeks', () =>
    expect(
      calculatePregnancyWeeks('2026-01-01', new Date('2026-01-15T00:00:00Z')),
    ).toBe(2));
  it('calculates score', () => expect(score(8, 10)).toBe(80));
  it('requires consent', () =>
    expect(registrationSchema.safeParse({}).success).toBe(false));
});
