import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DONORS, INITIAL_REQUESTS, BLOOD_COMPATIBILITY } from '../data/mockData';

const BloodRequestContext = createContext();

export const BloodRequestProvider = ({ children }) => {
  // Donors state
  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem('bloodlink_donors');
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  // Requests state
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('bloodlink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Active appointments state (for Amit Kumar)
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('bloodlink_appointments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'apt-1',
        title: 'Booking for blood donation appointment',
        center: 'Red Cross Delhi',
        address: '1 Red Cross Road, New Delhi',
        date: '25 Nov 2026',
        time: '10:00 AM',
        status: 'Confirmed'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bloodlink_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('bloodlink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('bloodlink_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Submit emergency or regular request
  const submitRequest = (newRequestData) => {
    const newReqId = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const compatibleGroups = BLOOD_COMPATIBILITY[newRequestData.bloodGroup]?.canReceiveFrom || [newRequestData.bloodGroup];

    // Find instant matching donors
    const matchedCount = donors.filter(d => 
      d.isAvailable && 
      compatibleGroups.includes(d.bloodGroup) &&
      (newRequestData.city === 'All Cities' || d.city.toLowerCase().includes(newRequestData.city.toLowerCase()))
    ).length;

    const requestItem = {
      id: newReqId,
      patientName: newRequestData.patientName,
      requesterName: newRequestData.requesterName || newRequestData.patientName,
      requesterEmail: newRequestData.requesterEmail || 'user@example.com',
      bloodGroup: newRequestData.bloodGroup,
      unitsRequired: parseInt(newRequestData.unitsRequired || 1, 10),
      unitsFulfilled: 0,
      hospitalName: newRequestData.hospitalName,
      city: newRequestData.city || 'New Delhi',
      hospitalAddress: newRequestData.hospitalAddress || 'Main Hospital Campus',
      roomNumber: newRequestData.roomNumber || 'Emergency Ward',
      contactNumber: newRequestData.contactNumber,
      priority: newRequestData.priority || 'High',
      status: 'Pending',
      requiredDate: newRequestData.requiredDate || 'Immediate',
      createdAt: 'Just now',
      notes: newRequestData.notes || 'Emergency request generated via BloodLink',
      matchedDonor: null,
      progressPercent: 25,
      matchedDonorsCount: matchedCount
    };

    setRequests(prev => [requestItem, ...prev]);
    return requestItem;
  };

  // Donor accepts incoming request
  const acceptRequest = (requestId, donor) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'In Progress - Donor Found',
          matchedDonor: {
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            phone: donor.phone,
            status: 'Confirmed'
          },
          unitsFulfilled: Math.min(req.unitsRequired, req.unitsFulfilled + 1),
          progressPercent: 75
        };
      }
      return req;
    }));
  };

  // Donor declines incoming request
  const declineRequest = (requestId) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  // Requester or Admin cancels request
  const cancelRequest = (requestId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'Cancelled', progressPercent: 0 };
      }
      return req;
    }));
  };

  // Admin approves or updates status
  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        let progress = 25;
        if (newStatus === 'In Progress - Donor Found') progress = 75;
        if (newStatus === 'Completed') progress = 100;
        if (newStatus === 'Cancelled') progress = 0;
        return { ...req, status: newStatus, progressPercent: progress };
      }
      return req;
    }));
  };

  // Admin verifies or flags a donor
  const toggleDonorVerification = (donorId) => {
    setDonors(prev => prev.map(d => {
      if (d.id === donorId) {
        return { ...d, isVerified: !d.isVerified };
      }
      return d;
    }));
  };

  // Reschedule appointment
  const rescheduleAppointment = (aptId, newDate, newTime) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === aptId) {
        return { ...a, date: newDate || '28 Nov 2026', time: newTime || '11:30 AM' };
      }
      return a;
    }));
  };

  // Search donors with multi-criteria filters
  const searchDonors = ({ bloodGroup = '', city = '', availabilityOnly = false, searchQuery = '' }) => {
    return donors.filter(donor => {
      // Blood Group match
      if (bloodGroup && bloodGroup !== 'All' && donor.bloodGroup !== bloodGroup) {
        return false;
      }
      // City match
      if (city && city !== 'All Cities' && !donor.city.toLowerCase().includes(city.toLowerCase())) {
        return false;
      }
      // Availability filter
      if (availabilityOnly && !donor.isAvailable) {
        return false;
      }
      // General search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(query);
        const matchesCity = donor.city.toLowerCase().includes(query);
        const matchesBlood = donor.bloodGroup.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesBlood) return false;
      }
      return true;
    });
  };

  // Aggregated system stats
  const stats = {
    totalDonors: donors.length + 50200, // Show realistic community scale + local mock
    activeRequests: requests.filter(r => r.status === 'Pending' || r.status === 'In Progress - Donor Found').length,
    fulfilledRequests: requests.filter(r => r.status === 'Completed').length + 10450,
    criticalRequests: requests.filter(r => r.priority === 'Critical' && r.status !== 'Completed').length,
    fulfillmentRate: '98.6%'
  };

  return (
    <BloodRequestContext.Provider
      value={{
        donors,
        requests,
        appointments,
        stats,
        submitRequest,
        acceptRequest,
        declineRequest,
        cancelRequest,
        updateRequestStatus,
        toggleDonorVerification,
        rescheduleAppointment,
        searchDonors
      }}
    >
      {children}
    </BloodRequestContext.Provider>
  );
};

export const useBloodRequest = () => useContext(BloodRequestContext);
