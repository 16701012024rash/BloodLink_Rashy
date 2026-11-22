import { supabase, isSupabaseConfigured } from './supabaseClient';

export const authService = {
  /**
   * Register a new normal user account
   */
  async signUp({
    email,
    password,
    fullName,
    phone,
    dateOfBirth,
    gender,
    country = 'India',
    state = 'Delhi',
    city = 'New Delhi',
    locality = '',
    pincode = '',
    bloodGroup = null,
    isDonor = false
  }) {
    if (!isSupabaseConfigured) {
      console.warn('[BloodLink Auth] Operating in local sandbox mode.');
      const localUser = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        phone,
        date_of_birth: dateOfBirth,
        gender,
        country,
        state,
        city,
        locality,
        pincode,
        isDonor: Boolean(isDonor || bloodGroup),
        bloodGroup: bloodGroup || (isDonor ? 'O+' : null),
        donorProfile: (isDonor || bloodGroup) ? {
          blood_group: bloodGroup || 'O+',
          availability: true,
          verification_status: 'pending',
          total_donations: 0,
          lives_impacted: 0
        } : null,
        isAdmin: false
      };
      return { user: localUser, session: { access_token: 'local-token' }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          date_of_birth: dateOfBirth,
          gender,
          country,
          state,
          city,
          locality,
          pincode,
          blood_group: bloodGroup,
          is_donor: isDonor
        }
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Unified Sign In
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured) {
      console.warn('[BloodLink Auth] Operating in local sandbox mode.');
      // Simple offline session for demonstration
      const localUser = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace('.', ' '),
        city: 'New Delhi',
        isDonor: true,
        bloodGroup: 'O+',
        donorProfile: {
          blood_group: 'O+',
          availability: true,
          verification_status: 'verified',
          total_donations: 4,
          lives_impacted: 12
        },
        isAdmin: false
      };
      return { user: localUser, session: { access_token: 'local-token' }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign Out
   */
  async signOut() {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Send Password Reset Email
   */
  async resetPassword(email) {
    if (!isSupabaseConfigured) {
      return { message: 'Password reset link simulated for ' + email };
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=success`
    });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch complete user profile including optional donor profile and admin verification
   */
  async getProfile(userId) {
    if (!isSupabaseConfigured || !userId) return null;

    try {
      const [
        { data: profile, error: pError },
        { data: donorData, error: dError },
        { data: adminData, error: aError }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('donor_profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle()
      ]);

      if (pError && pError.code !== 'PGRST116') throw pError;
      if (!profile) return null;

      return {
        ...profile,
        donorProfile: donorData || null,
        isDonor: Boolean(donorData),
        bloodGroup: donorData?.blood_group || null,
        isAdmin: Boolean(adminData)
      };
    } catch (err) {
      console.error('Failed to get profile from Supabase:', err);
      return null;
    }
  },

  /**
   * Update personal profile
   */
  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured) return updates;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Register the current user as a donor
   */
  async registerAsDonor(userId, donorData) {
    if (!isSupabaseConfigured) {
      return {
        user_id: userId,
        blood_group: donorData.bloodGroup || 'O+',
        availability: true,
        verification_status: 'pending'
      };
    }

    const { data, error } = await supabase
      .from('donor_profiles')
      .upsert({
        user_id: userId,
        blood_group: donorData.bloodGroup,
        rh_factor: donorData.rhFactor || '+',
        availability: donorData.availability ?? true,
        last_donation_date: donorData.lastDonationDate || null,
        preferred_radius_km: donorData.preferredRadius || 25,
        bio: donorData.bio || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Verify Secret Admin Key on Backend
   */
  async verifyAdminKey(secretKey) {
    if (!secretKey) return false;

    if (!isSupabaseConfigured) {
      // In local sandbox development mode:
      const DEV_ADMIN_KEY = 'BLOODLINK_SECURE_ADMIN_2026_ROOT';
      return secretKey.trim() === DEV_ADMIN_KEY;
    }

    const { data, error } = await supabase.rpc('verify_admin_key', {
      p_key: secretKey.trim()
    });

    if (error) {
      console.error('Admin key verification RPC failed:', error);
      return false;
    }

    return Boolean(data);
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};
