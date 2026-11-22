/**
 * BloodLink Clinical Blood Compatibility Engine
 * 
 * IMPORTANT MEDICAL DISCLAIMER:
 * This compatibility matrix provides preliminary algorithmic matching based on standard
 * ABO/RhD blood grouping. Final compatibility, crossmatching, screening for atypical antibodies,
 * and clinical transfusion approval MUST be performed by authorized hospital blood bank pathologists.
 */

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const COMPONENT_TYPES = [
  'Whole Blood',
  'Red Blood Cells',
  'Platelets',
  'Plasma',
  'Cryoprecipitate'
];

/**
 * Standard ABO/RhD Red Blood Cell (PRBC) and Whole Blood compatibility
 * Antigen/Antibody rules:
 * - O- has no A, B, or Rh antigens -> Universal RBC Donor
 * - AB+ has A, B, and Rh antigens, no antibodies -> Universal RBC Recipient
 */
export const RBC_COMPATIBILITY = {
  'A+': {
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    canDonateTo: ['A+', 'AB+']
  },
  'A-': {
    canReceiveFrom: ['A-', 'O-'],
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-']
  },
  'B+': {
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    canDonateTo: ['B+', 'AB+']
  },
  'B-': {
    canReceiveFrom: ['B-', 'O-'],
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-']
  },
  'AB+': {
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
    canDonateTo: ['AB+']
  },
  'AB-': {
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    canDonateTo: ['AB+', 'AB-']
  },
  'O+': {
    canReceiveFrom: ['O+', 'O-'],
    canDonateTo: ['O+', 'A+', 'B+', 'AB+']
  },
  'O-': {
    canReceiveFrom: ['O-'],
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal Donor
  }
};

/**
 * Plasma (Fresh Frozen Plasma - FFP) compatibility rules:
 * Inverse of RBC compatibility because plasma contains antibodies, not RBC antigens:
 * - AB plasma has neither anti-A nor anti-B antibodies -> Universal Plasma Donor
 * - O plasma contains both anti-A and anti-B antibodies -> Can only donate plasma to O
 */
export const PLASMA_COMPATIBILITY = {
  'O': {
    canReceiveFrom: ['O', 'A', 'B', 'AB'],
    canDonateTo: ['O']
  },
  'A': {
    canReceiveFrom: ['A', 'AB'],
    canDonateTo: ['A', 'O']
  },
  'B': {
    canReceiveFrom: ['B', 'AB'],
    canDonateTo: ['B', 'O']
  },
  'AB': {
    canReceiveFrom: ['AB'],
    canDonateTo: ['AB', 'A', 'B', 'O'] // Universal Plasma Donor
  }
};

/**
 * Check if a donor is compatible with a patient based on blood group and component type
 */
export function isClinicallyCompatible(donorBlood, patientBlood, componentType = 'Whole Blood') {
  if (!donorBlood || !patientBlood) return false;

  const normalizedDonor = donorBlood.trim().toUpperCase();
  const normalizedPatient = patientBlood.trim().toUpperCase();

  if (componentType === 'Plasma') {
    // Strip Rh factor for plasma ABO matching
    const donorABO = normalizedDonor.replace(/[+-]/g, '');
    const patientABO = normalizedPatient.replace(/[+-]/g, '');

    const plasmaRules = PLASMA_COMPATIBILITY[patientABO];
    return plasmaRules ? plasmaRules.canReceiveFrom.includes(donorABO) : false;
  }

  // Default to RBC / Whole Blood / Platelets compatibility
  const rules = RBC_COMPATIBILITY[normalizedPatient];
  return rules ? rules.canReceiveFrom.includes(normalizedDonor) : false;
}

/**
 * Get list of compatible donor blood groups for a patient's request
 */
export function getCompatibleDonorGroups(patientBlood, componentType = 'Whole Blood') {
  if (!patientBlood) return [];
  const normalized = patientBlood.trim().toUpperCase();

  if (componentType === 'Plasma') {
    const abo = normalized.replace(/[+-]/g, '');
    const validABOs = PLASMA_COMPATIBILITY[abo]?.canReceiveFrom || [abo];
    // Return with + and - variations
    return BLOOD_GROUPS.filter(bg => validABOs.includes(bg.replace(/[+-]/g, '')));
  }

  return RBC_COMPATIBILITY[normalized]?.canReceiveFrom || [normalized];
}

/**
 * Get clinical advice and antigen/antibody summary for UI display
 */
export function getCompatibilityDetails(bloodGroup) {
  if (!bloodGroup || !RBC_COMPATIBILITY[bloodGroup]) {
    return {
      canReceiveFrom: [],
      canDonateTo: [],
      summary: 'Unknown blood group.'
    };
  }

  const { canReceiveFrom, canDonateTo } = RBC_COMPATIBILITY[bloodGroup];
  let summary = `Can receive from ${canReceiveFrom.join(', ')}. Can donate to ${canDonateTo.join(', ')}.`;

  if (bloodGroup === 'O-') {
    summary += ' Universal RBC Donor for emergency golden hour resuscitation.';
  } else if (bloodGroup === 'AB+') {
    summary += ' Universal RBC Recipient, capable of receiving blood from all groups.';
  }

  return {
    canReceiveFrom,
    canDonateTo,
    summary
  };
}
