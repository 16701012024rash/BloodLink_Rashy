import { describe, it, expect } from 'vitest';
import { 
  calculateNextEligibleDate, 
  evaluateDonorMedicalEligibility,
  DONATION_INTERVALS_DAYS 
} from '../utils/eligibility';

describe('Medical Donor Eligibility Engine', () => {
  it('confirms eligibility for first-time donors', () => {
    const result = calculateNextEligibleDate('First Time Donor', 'Whole Blood', 'male');
    expect(result.isEligibleNow).toBe(true);
    expect(result.formattedDate).toBe('Eligible Now!');
    expect(result.daysRemaining).toBe(0);
  });

  it('enforces 90-day cooldown for male whole blood donations', () => {
    // 30 days ago
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - 30);

    const result = calculateNextEligibleDate(lastDate.toISOString(), 'Whole Blood', 'male');
    expect(result.isEligibleNow).toBe(false);
    expect(result.daysRemaining).toBeGreaterThan(50);
  });

  it('allows donation after 90 days have elapsed', () => {
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - 95);

    const result = calculateNextEligibleDate(lastDate.toISOString(), 'Whole Blood', 'male');
    expect(result.isEligibleNow).toBe(true);
    expect(result.daysRemaining).toBeLessThanOrEqual(0);
  });

  it('enforces 14-day interval for platelet apheresis', () => {
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - 10);

    const result = calculateNextEligibleDate(lastDate.toISOString(), 'Platelets', 'male');
    expect(result.isEligibleNow).toBe(false);
    expect(result.daysRemaining).toBeLessThanOrEqual(5);
  });

  it('rejects donors below 18 years of age', () => {
    const evaluation = evaluateDonorMedicalEligibility({
      age: 17,
      weight: 60,
      lastDonated: 'First Time Donor'
    });
    expect(evaluation.isEligible).toBe(false);
    expect(evaluation.issues[0]).toContain('at least 18 years old');
  });

  it('rejects donors below 45 kg weight threshold', () => {
    const evaluation = evaluateDonorMedicalEligibility({
      age: 25,
      weight: 42,
      lastDonated: 'First Time Donor'
    });
    expect(evaluation.isEligible).toBe(false);
    expect(evaluation.issues[0]).toContain('Minimum body weight of 45 kg');
  });
});
