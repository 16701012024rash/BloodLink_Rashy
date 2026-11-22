import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { donorService } from '../services/donorService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bloodlink_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged-in user in development if saved, or clean session
    return {
      id: 'usr-default-1',
      name: 'Amit Kumar',
      full_name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '+91 98765 43210',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      locality: 'Connaught Place',
      pincode: '110001',
      isDonor: true,
      bloodGroup: 'O+',
      isAvailable: true,
      donorProfile: {
        blood_group: 'O+',
        availability: true,
        verification_status: 'verified',
        total_donations: 4,
        lives_impacted: 12,
        last_donation_date: '12 Oct 2026',
        next_eligible_date: 'Eligible Now!',
        badges: ['Life Saver', 'Regular Donor']
      },
      isAdmin: false
    };
  });

  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Sync Supabase Auth listener
  useEffect(() => {
    if (isSupabaseConfigured) {
      setLoading(true);
      const { data: authListener } = authService.onAuthStateChange(async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          try {
            const profile = await authService.getProfile(currentSession.user.id);
            if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.full_name,
                full_name: profile.full_name,
                email: profile.email,
                phone: profile.phone,
                city: profile.city || 'New Delhi',
                state: profile.state || 'Delhi',
                country: profile.country || 'India',
                locality: profile.locality || '',
                pincode: profile.pincode || '',
                latitude: profile.latitude,
                longitude: profile.longitude,
                isDonor: profile.isDonor,
                bloodGroup: profile.bloodGroup,
                isAvailable: profile.donorProfile?.availability ?? false,
                donorProfile: profile.donorProfile,
                isAdmin: profile.isAdmin,
                avatar: profile.profile_image
              });
            }
          } catch (err) {
            console.error('Failed to sync auth session:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bloodlink_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bloodlink_user');
    }
  }, [currentUser]);

  /**
   * Unified Login
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const result = await authService.signIn({ email, password });
        return result;
      }

      // Offline sandbox authentication
      const user = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        full_name: email.split('@')[0].replace('.', ' '),
        email,
        phone: '+91 98765 43210',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        isDonor: true,
        bloodGroup: 'O+',
        isAvailable: true,
        donorProfile: {
          blood_group: 'O+',
          availability: true,
          verification_status: 'verified',
          total_donations: 4,
          lives_impacted: 12
        },
        isAdmin: false
      };
      setCurrentUser(user);
      return { user };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unified Registration (creates single user profile with optional donor opt-in)
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        return await authService.signUp(userData);
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.fullName || userData.full_name,
        full_name: userData.fullName || userData.full_name,
        email: userData.email,
        phone: userData.phone,
        date_of_birth: userData.dateOfBirth,
        gender: userData.gender,
        country: userData.country || 'India',
        state: userData.state || 'Delhi',
        city: userData.city || 'New Delhi',
        locality: userData.locality || '',
        pincode: userData.pincode || '',
        isDonor: Boolean(userData.isDonor || userData.bloodGroup),
        bloodGroup: userData.bloodGroup || (userData.isDonor ? 'O+' : null),
        isAvailable: true,
        donorProfile: (userData.isDonor || userData.bloodGroup) ? {
          blood_group: userData.bloodGroup || 'O+',
          availability: true,
          verification_status: 'pending',
          total_donations: 0,
          lives_impacted: 0
        } : null,
        isAdmin: false
      };
      setCurrentUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log Out
   */
  const logout = async () => {
    if (isSupabaseConfigured) {
      await authService.signOut();
    }
    setCurrentUser(null);
  };

  /**
   * Reset Password
   */
  const resetPassword = async (email) => {
    return authService.resetPassword(email);
  };

  /**
   * Update Profile Details
   */
  const updateProfile = async (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    if (isSupabaseConfigured) {
      await authService.updateProfile(currentUser.id, updates);
    }
    return updated;
  };

  /**
   * Become a Donor / Register as Donor for existing user
   */
  const registerAsDonor = async (donorData) => {
    if (!currentUser) return;
    const newDonorProfile = {
      blood_group: donorData.bloodGroup,
      rh_factor: donorData.rhFactor || '+',
      availability: true,
      verification_status: 'pending',
      total_donations: 0,
      lives_impacted: 0
    };

    const updated = {
      ...currentUser,
      isDonor: true,
      bloodGroup: donorData.bloodGroup,
      isAvailable: true,
      donorProfile: newDonorProfile
    };
    setCurrentUser(updated);

    if (isSupabaseConfigured) {
      await authService.registerAsDonor(currentUser.id, donorData);
    }
    return updated;
  };

  /**
   * Toggle Donor Availability
   */
  const toggleDonorAvailability = async () => {
    if (!currentUser || !currentUser.isDonor) return;
    const newStatus = !currentUser.isAvailable;
    const updated = {
      ...currentUser,
      isAvailable: newStatus,
      donorProfile: {
        ...currentUser.donorProfile,
        availability: newStatus
      }
    };
    setCurrentUser(updated);

    if (isSupabaseConfigured) {
      await donorService.updateAvailability(currentUser.id, newStatus);
    }
  };

  /**
   * Verify and activate Secret Admin Access
   */
  const verifyAdminAccess = async (secretKey) => {
    const isValid = await authService.verifyAdminKey(secretKey);
    if (isValid && currentUser) {
      const updated = { ...currentUser, isAdmin: true };
      setCurrentUser(updated);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        session,
        isSupabaseConfigured,
        isAuthenticated: !!currentUser,
        isDonor: Boolean(currentUser?.isDonor),
        isAdmin: Boolean(currentUser?.isAdmin),
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        registerAsDonor,
        toggleDonorAvailability,
        verifyAdminAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
