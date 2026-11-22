/**
 * BloodLink Medical Donor Eligibility Engine
 * 
 * Clinical guidelines based on National Blood Transfusion Council (NBTC) 
 * & Central Drugs Standard Control Organization (CDSCO) standards:
 * - Whole Blood cooldown: 90 days (males), 120 days (females)
 * - Platelet apheresis cooldown: 14 days (max 24 donations/year)
 * - Plasma apheresis cooldown: 28 days
 * - Age limit: 18 - 65 years
 * - Weight: Minimum 45 kg (for 350ml) / 50 kg (for 450ml)
 * - Minimum Hemoglobin: 12.5 g/dL
 */

export const DONATION_INTERVALS_DAYS = {
  'Whole Blood': {
    male: 90,
    female: 120,
    default: 90
  },
  'Red Blood Cells': {
    male: 112,
    female: 112,
    default: 112
  },
  'Platelets': {
    male: 14,
    female: 14,
    default: 14
  },
  'Plasma': {
    male: 28,
    female: 28,
    default: 28
  }
};

/**
 * Calculates the next eligible donation date based on component type and last donation
 */
export function calculateNextEligibleDate(lastDonationDateStr, componentType = 'Whole Blood', gender = 'male') {
  if (!lastDonationDateStr || lastDonationDateStr === 'First Time Donor') {
    return {
      isEligibleNow: true,
      nextEligibleDate: new Date(),
      formattedDate: 'Eligible Now!',
      daysRemaining: 0
    };
  }

  const lastDate = new Date(lastDonationDateStr);
  if (isNaN(lastDate.getTime())) {
    return {
      isEligibleNow: true,
      nextEligibleDate: new Date(),
      formattedDate: 'Eligible Now!',
      daysRemaining: 0
    };
  }

  const intervalRules = DONATION_INTERVALS_DAYS[componentType] || DONATION_INTERVALS_DAYS['Whole Blood'];
  const intervalDays = intervalRules[gender.toLowerCase()] || intervalRules.default;

  const nextEligible = new Date(lastDate);
  nextEligible.setDate(nextEligible.getDate() + intervalDays);

  const today = new Date();
  const diffTime = nextEligible.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      isEligibleNow: true,
      nextEligibleDate: nextEligible,
      formattedDate: 'Eligible Now!',
      daysRemaining: 0
    };
  }

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return {
    isEligibleNow: false,
    nextEligibleDate: nextEligible,
    formattedDate: nextEligible.toLocaleDateString('en-IN', options),
    daysRemaining
  };
}

/**
 * Evaluates comprehensive medical eligibility
 */
export function evaluateDonorMedicalEligibility(donorProfile) {
  const issues = [];

  // Age check
  if (donorProfile.age != null) {
    if (donorProfile.age < 18) {
      issues.push('Must be at least 18 years old to donate blood.');
    } else if (donorProfile.age > 65) {
      issues.push('Donors over 65 require clinical clearance by a medical officer.');
    }
  }

  // Weight check
  if (donorProfile.weight != null && donorProfile.weight < 45) {
    issues.push('Minimum body weight of 45 kg required for whole blood donation.');
  }

  // Interval cooldown check
  const cooldown = calculateNextEligibleDate(
    donorProfile.last_donation_date || donorProfile.lastDonated,
    donorProfile.component_type || 'Whole Blood',
    donorProfile.gender || 'male'
  );

  if (!cooldown.isEligibleNow) {
    issues.push(`Mandatory medical cooldown active: eligible in ${cooldown.daysRemaining} days (${cooldown.formattedDate}).`);
  }

  return {
    isEligible: issues.length === 0,
    status: issues.length === 0 ? 'eligible' : 'cooldown',
    cooldown,
    issues
  };
}
