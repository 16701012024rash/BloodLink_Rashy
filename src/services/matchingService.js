import { isClinicallyCompatible, getCompatibleDonorGroups } from '../utils/bloodCompatibility';
import { calculateDistanceKm } from '../utils/distanceCalculator';
import { evaluateDonorMedicalEligibility } from '../utils/eligibility';
import { notificationService } from './notificationService';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const matchingService = {
  /**
   * Evaluates algorithmic matches for a blood request against a list of donors
   */
  findMatches({
    request,
    donors = [],
    maxRadiusKm = 25,
    requireVerified = false,
    requireAvailable = true
  }) {
    if (!request) return [];

    const requestLat = request.latitude != null ? Number(request.latitude) : null;
    const requestLon = request.longitude != null ? Number(request.longitude) : null;
    const componentType = request.component_type || request.componentType || 'Whole Blood';
    const patientBlood = request.blood_group || request.bloodGroup;

    return donors
      .map(donor => {
        // 1. Clinical Blood Compatibility Check
        const isCompatible = isClinicallyCompatible(
          donor.blood_group || donor.bloodGroup,
          patientBlood,
          componentType
        );

        if (!isCompatible) return null;

        // 2. Availability Filter
        const isAvailable = donor.availability ?? donor.isAvailable ?? true;
        if (requireAvailable && !isAvailable) return null;

        // 3. Verification Filter
        const isVerified = (donor.verification_status === 'verified') || (donor.isVerified === true);
        if (requireVerified && !isVerified) return null;

        // 4. Medical Eligibility & Cooldown Check
        const eligibility = evaluateDonorMedicalEligibility({
          age: donor.age,
          weight: donor.weight,
          last_donation_date: donor.last_donation_date || donor.lastDonated,
          component_type: componentType,
          gender: donor.gender || 'male'
        });

        if (!eligibility.isEligible) return null;

        // 5. Geospatial Distance Calculation
        const donorLat = donor.latitude != null ? Number(donor.latitude) : null;
        const donorLon = donor.longitude != null ? Number(donor.longitude) : null;

        let distanceKm = null;
        if (requestLat != null && requestLon != null && donorLat != null && donorLon != null) {
          distanceKm = calculateDistanceKm(requestLat, requestLon, donorLat, donorLon);
          if (maxRadiusKm && distanceKm > maxRadiusKm) return null;
        }

        return {
          donor,
          donorId: donor.id || donor.user_id,
          distanceKm,
          isCompatible: true,
          eligibility
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  },

  /**
   * Dispatches emergency notifications to all matched donors
   */
  async notifyMatchedDonors(request, matchedDonors = []) {
    const results = [];
    const urgency = request.urgency_level || request.priority || 'Critical';
    const hospital = request.hospital_name || request.hospitalName;
    const bloodGroup = request.blood_group || request.bloodGroup;
    const units = request.units_required || request.unitsRequired || 1;

    for (const match of matchedDonors) {
      const donor = match.donor;
      const donorUserId = donor.id || donor.user_id;

      if (!donorUserId) continue;

      try {
        const notif = await notificationService.createNotification({
          userId: donorUserId,
          title: `🚨 ${urgency} Blood Match: ${bloodGroup} Needed`,
          message: `${units} Unit(s) needed urgently at ${hospital} (${match.distanceKm != null ? `${match.distanceKm} km away` : 'nearby'}). Can you help?`,
          type: 'emergency',
          actionUrl: '/donor-dashboard'
        });
        results.push(notif);
      } catch (err) {
        console.error(`Failed to dispatch alert to donor ${donorUserId}:`, err);
      }
    }

    return results;
  }
};
