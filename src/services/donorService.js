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

    try {
      let query = supabase
        .from('donor_profiles')
        .select(`
          *,
          profiles!inner(id, full_name, email, phone, profile_image, city, latitude, longitude)
        `);

      if (availabilityOnly) {
        query = query.eq('availability', true);
      }

      if (bloodGroup && bloodGroup !== 'All') {
        query = query.eq('blood_group', bloodGroup);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[BloodLink] Joined getDonors failed, falling back:', error.message);
        return INITIAL_DONORS;
      }

      // Map database record to clean UI donor format
      const formatted = (data || []).map(record => {
        const donorCity = record.city || record.profiles?.city || 'New Delhi';
        const donorLat = Number(record.latitude || record.profiles?.latitude || 28.6139);
        const donorLon = Number(record.longitude || record.profiles?.longitude || 77.2090);
        const distance = (targetLat && targetLon)
          ? calculateDistanceKm(targetLat, targetLon, donorLat, donorLon)
          : null;

        return {
          id: record.profiles?.id || record.user_id,
          name: record.profiles?.full_name || 'Donor',
          email: record.profiles?.email || '',
          phone: record.profiles?.phone || '',
          bloodGroup: record.blood_group,
          city: donorCity,
          latitude: donorLat,
          longitude: donorLon,
          isAvailable: Boolean(record.availability),
          isVerified: record.verification_status === 'verified',
          verificationStatus: record.verification_status,
          lastDonated: record.last_donation_date || 'First Time Donor',
          eligibilityStatus: record.eligibility_status,
          nextEligibleDate: record.next_eligible_date || 'Eligible Now!',
          totalDonations: record.total_donations || 0,
          livesImpacted: record.lives_impacted || 0,
          badges: record.badges || ['Lifesaver'],
          bio: record.bio || '',
          avatar: record.profiles?.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          distanceKm: distance
        };
      });

      if (city && city !== 'All Cities') {
        return formatted.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
      }

      if (targetLat && targetLon && maxRadiusKm) {
        return formatted.filter(d => d.distanceKm == null || d.distanceKm <= maxRadiusKm);
      }

      return formatted;
    } catch (err) {
      console.error('[BloodLink] Failed to fetch donors:', err);
      return INITIAL_DONORS;
    }
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
