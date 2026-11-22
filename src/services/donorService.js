import { supabase, isSupabaseConfigured } from './supabaseClient';
import { calculateDistanceKm, CITY_COORDINATES } from '../utils/distanceCalculator';
import { isClinicallyCompatible } from '../utils/bloodCompatibility';
import { INITIAL_DONORS } from '../data/mockData';

export const donorService = {
  /**
   * Fetch donors with filtering for blood group, city, radius, and availability
   */
  async getDonors({ bloodGroup, city, availabilityOnly = true, targetLat, targetLon, maxRadiusKm = 50 }) {
    if (!isSupabaseConfigured) {
      // Local fallback using mock data
      return INITIAL_DONORS.filter(d => {
        if (bloodGroup && bloodGroup !== 'All' && d.bloodGroup !== bloodGroup) return false;
        if (city && city !== 'All Cities' && !d.city.toLowerCase().includes(city.toLowerCase())) return false;
        if (availabilityOnly && !d.isAvailable) return false;
        return true;
      });
    }

    let query = supabase
      .from('donor_profiles')
      .select(`
        user_id,
        blood_group,
        city,
        latitude,
        longitude,
        availability,
        verification_status,
        last_donation_date,
        eligibility_status,
        next_eligible_date,
        total_donations,
        lives_impacted,
        badges,
        bio,
        preferred_radius_km,
        profiles!inner(id, full_name, email, phone, profile_image)
      `);

    if (availabilityOnly) {
      query = query.eq('availability', true);
    }

    if (bloodGroup && bloodGroup !== 'All') {
      query = query.eq('blood_group', bloodGroup);
    }

    if (city && city !== 'All Cities') {
      query = query.ilike('city', `%${city}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Map database record to clean UI donor format
    const formatted = data.map(record => {
      const distance = (targetLat && targetLon && record.latitude && record.longitude)
        ? calculateDistanceKm(targetLat, targetLon, record.latitude, record.longitude)
        : null;

      return {
        id: record.profiles.id,
        name: record.profiles.full_name,
        email: record.profiles.email,
        phone: record.profiles.phone,
        bloodGroup: record.blood_group,
        city: record.city,
        latitude: record.latitude,
        longitude: record.longitude,
        isAvailable: record.availability,
        isVerified: record.verification_status === 'verified',
        verificationStatus: record.verification_status,
        lastDonated: record.last_donation_date || 'First Time Donor',
        eligibilityStatus: record.eligibility_status,
        nextEligibleDate: record.next_eligible_date || 'Eligible Now!',
        totalDonations: record.total_donations,
        livesImpacted: record.lives_impacted,
        badges: record.badges || ['Lifesaver'],
        bio: record.bio || '',
        avatar: record.profiles.profile_image,
        distanceKm: distance
      };
    });

    if (targetLat && targetLon && maxRadiusKm) {
      return formatted.filter(d => d.distanceKm == null || d.distanceKm <= maxRadiusKm);
    }

    return formatted;
  },

  /**
   * Update availability toggle
   */
  async updateAvailability(userId, isAvailable) {
    if (!isSupabaseConfigured) return { availability: isAvailable };

    const { data, error } = await supabase
      .from('donor_profiles')
      .update({ availability: isAvailable, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Upload donor verification document (e.g. Govt ID or Blood Report)
   */
  async uploadVerificationDocument(userId, file, documentType = 'Govt ID') {
    if (!isSupabaseConfigured) {
      return { status: 'pending', message: 'Document upload simulated in sandbox mode' };
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('verification-docs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data, error: dbError } = await supabase
      .from('verification_documents')
      .insert({
        user_id: userId,
        document_type: documentType,
        document_path: filePath,
        verification_status: 'pending'
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return data;
  }
};
