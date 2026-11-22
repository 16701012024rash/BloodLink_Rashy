import { describe, it, expect } from 'vitest';
import { 
  isClinicallyCompatible, 
  getCompatibleDonorGroups, 
  getCompatibilityDetails,
  RBC_COMPATIBILITY,
  PLASMA_COMPATIBILITY 
} from '../utils/bloodCompatibility';

describe('Blood Compatibility Engine', () => {
  describe('RBC / Whole Blood Compatibility', () => {
    it('identifies O- as Universal Red Blood Cell Donor', () => {
      const allGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      allGroups.forEach(patientBlood => {
        expect(isClinicallyCompatible('O-', patientBlood, 'Whole Blood')).toBe(true);
        expect(isClinicallyCompatible('O-', patientBlood, 'Red Blood Cells')).toBe(true);
      });
    });

    it('identifies AB+ as Universal Red Blood Cell Recipient', () => {
      const allGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      allGroups.forEach(donorBlood => {
        expect(isClinicallyCompatible(donorBlood, 'AB+', 'Whole Blood')).toBe(true);
      });
    });

    it('rejects Rh-positive blood for Rh-negative recipients', () => {
      expect(isClinicallyCompatible('A+', 'A-', 'Whole Blood')).toBe(false);
      expect(isClinicallyCompatible('O+', 'O-', 'Whole Blood')).toBe(false);
      expect(isClinicallyCompatible('B+', 'B-', 'Whole Blood')).toBe(false);
      expect(isClinicallyCompatible('AB+', 'AB-', 'Whole Blood')).toBe(false);
    });

    it('rejects mismatched ABO types', () => {
      expect(isClinicallyCompatible('A+', 'B+', 'Whole Blood')).toBe(false);
      expect(isClinicallyCompatible('B+', 'A+', 'Whole Blood')).toBe(false);
      expect(isClinicallyCompatible('AB+', 'O+', 'Whole Blood')).toBe(false);
    });

    it('returns exact compatible donor groups for A+', () => {
      const compatible = getCompatibleDonorGroups('A+', 'Whole Blood');
      expect(compatible).toEqual(['A+', 'A-', 'O+', 'O-']);
    });

    it('returns exact compatible donor groups for O-', () => {
      const compatible = getCompatibleDonorGroups('O-', 'Whole Blood');
      expect(compatible).toEqual(['O-']);
    });
  });

  describe('Plasma Compatibility', () => {
    it('identifies AB as Universal Plasma Donor', () => {
      expect(isClinicallyCompatible('AB+', 'O+', 'Plasma')).toBe(true);
      expect(isClinicallyCompatible('AB-', 'A+', 'Plasma')).toBe(true);
      expect(isClinicallyCompatible('AB+', 'B+', 'Plasma')).toBe(true);
      expect(isClinicallyCompatible('AB-', 'AB+', 'Plasma')).toBe(true);
    });

    it('restricts O plasma to O recipients only', () => {
      expect(isClinicallyCompatible('O+', 'O+', 'Plasma')).toBe(true);
      expect(isClinicallyCompatible('O+', 'A+', 'Plasma')).toBe(false);
      expect(isClinicallyCompatible('O+', 'B+', 'Plasma')).toBe(false);
    });
  });

  describe('Compatibility Details & Summary', () => {
    it('returns clinical summary text for O-', () => {
      const details = getCompatibilityDetails('O-');
      expect(details.summary).toContain('Universal RBC Donor');
    });

    it('returns clinical summary text for AB+', () => {
      const details = getCompatibilityDetails('AB+');
      expect(details.summary).toContain('Universal RBC Recipient');
    });
  });
});
