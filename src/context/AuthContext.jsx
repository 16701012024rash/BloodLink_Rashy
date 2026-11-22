import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const MOCK_USERS = {
  donor: {
    id: 'donor-1',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    role: 'donor',
    bloodGroup: 'O+',
    city: 'New Delhi',
    phone: '+91 98765 43210',
    age: 28,
    isAvailable: true,
    totalDonations: 4,
    livesImpacted: 12,
    lastDonated: '12 Oct 2026',
    nextEligibleDate: 'Eligible Now!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    badges: ['Life Saver', 'Regular Donor']
  },
  requester: {
    id: 'req-user-1',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    role: 'requester',
    bloodGroup: 'A+',
    city: 'New Delhi',
    phone: '+91 98760 11223',
    bloodReceivedDate: '12 Oct 2026',
    totalTransfusions: 3,
    healthProgress: 'Improving',
    nextScheduledCheckup: '15 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    doctor: {
      name: 'Dr. A. Khan',
      specialty: 'Hematologist & Chief Physician',
      hospital: 'City Hospital, Delhi',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
    }
  },
  admin: {
    id: 'admin-1',
    name: 'Dr. Admin Officer',
    email: 'admin@bloodlink.org',
    role: 'admin',
    department: 'National Health Blood Commission',
    city: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bloodlink_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_USERS.donor;
      }
    }
    // Default to Amit Kumar as requested in the screenshot
    return MOCK_USERS.donor;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bloodlink_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bloodlink_user');
    }
  }, [currentUser]);

  const login = (email, password, role = 'donor') => {
    let user;
    if (role === 'admin' || email.includes('admin')) {
      user = MOCK_USERS.admin;
    } else if (role === 'requester' || email.includes('maria')) {
      user = MOCK_USERS.requester;
    } else {
      user = {
        ...MOCK_USERS.donor,
        email: email || MOCK_USERS.donor.email
      };
    }
    setCurrentUser(user);
    return user;
  };

  const register = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.fullName || userData.name,
      email: userData.email,
      phone: userData.phone,
      bloodGroup: userData.bloodGroup || 'O+',
      city: userData.city || 'New Delhi',
      role: userData.role || 'donor',
      age: userData.age || 25,
      isAvailable: true,
      totalDonations: 0,
      livesImpacted: 0,
      lastDonated: userData.lastDonationDate || 'First Time Donor',
      nextEligibleDate: 'Eligible Now!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      badges: ['New Lifesaver']
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleAvailability = () => {
    if (!currentUser || currentUser.role !== 'donor') return;
    const updated = {
      ...currentUser,
      isAvailable: !currentUser.isAvailable
    };
    setCurrentUser(updated);
  };

  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      setCurrentUser(MOCK_USERS[roleKey]);
    } else if (roleKey === 'guest') {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        toggleAvailability,
        switchRole,
        isAuthenticated: !!currentUser,
        isDonor: currentUser?.role === 'donor',
        isRequester: currentUser?.role === 'requester',
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
