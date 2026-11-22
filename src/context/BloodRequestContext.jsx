import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_DONORS, INITIAL_REQUESTS, BLOOD_COMPATIBILITY } from '../data/mockData';
import { requestService } from '../services/requestService';
import { donorService } from '../services/donorService';
import { matchingService } from '../services/matchingService';
import { adminService } from '../services/adminService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { calculateDistanceKm } from '../utils/distanceCalculator';

const BloodRequestContext = createContext();

export const BloodRequestProvider = ({ children }) => {
  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem('bloodlink_donors');
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('bloodlink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

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

  // Fetch initial live requests & donors from Supabase if configured
  useEffect(() => {
    let isMounted = true;

    async function loadLiveData() {
      if (isSupabaseConfigured) {
        try {
          const [liveDonors, liveRequests] = await Promise.all([
            donorService.getDonors({ availabilityOnly: false }),
            requestService.getRequests()
          ]);
          if (isMounted) {
            if (liveDonors?.length) setDonors(liveDonors);
            if (liveRequests?.length) setRequests(liveRequests);
          }
        } catch (err) {
          console.error('[BloodLink] Failed loading live Supabase data:', err);
        }
      }
    }

    loadLiveData();

    // Subscribe to real-time changes
    const subscription = requestService.subscribeToRequests((payload) => {
      if (payload.eventType === 'INSERT') {
        setRequests(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setRequests(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r));
      } else if (payload.eventType === 'DELETE') {
        setRequests(prev => prev.filter(r => r.id !== payload.old.id));
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('bloodlink_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('bloodlink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('bloodlink_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Submit emergency or regular request with algorithmic matching
  const submitRequest = async (newRequestData) => {
    const newReqId = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    
    // Find algorithmic matches
    const matches = matchingService.findMatches({
      request: newRequestData,
      donors,
      maxRadiusKm: newRequestData.radiusKm || 30
    });

    const requestItem = {
      id: newReqId,
      patientName: newRequestData.patientName,
      patient_name: newRequestData.patientName,
      requesterName: newRequestData.requesterName || newRequestData.patientName,
      requesterEmail: newRequestData.requesterEmail || 'user@example.com',
      bloodGroup: newRequestData.bloodGroup,
      blood_group: newRequestData.bloodGroup,
      componentType: newRequestData.componentType || 'Whole Blood',
      component_type: newRequestData.componentType || 'Whole Blood',
      unitsRequired: parseInt(newRequestData.unitsRequired || 1, 10),
      units_required: parseInt(newRequestData.unitsRequired || 1, 10),
      unitsFulfilled: 0,
      units_fulfilled: 0,
      hospitalName: newRequestData.hospitalName,
      hospital_name: newRequestData.hospitalName,
      city: newRequestData.city || 'New Delhi',
      hospitalAddress: newRequestData.hospitalAddress || 'Main Hospital Campus',
      hospital_location: newRequestData.hospitalAddress || 'Main Hospital Campus',
      roomNumber: newRequestData.roomNumber || 'Emergency Ward',
      contactNumber: newRequestData.contactNumber,
      contact_number: newRequestData.contactNumber,
      latitude: newRequestData.latitude || 28.6139,
      longitude: newRequestData.longitude || 77.2090,
      priority: newRequestData.priority || 'Critical (Golden Hour)',
      urgency_level: newRequestData.priority || 'Critical (Golden Hour)',
      status: 'Pending',
      request_status: 'Pending',
      requiredDate: newRequestData.requiredDate || 'Immediate',
      createdAt: 'Just now',
      notes: newRequestData.notes || 'Emergency request generated via BloodLink',
      additional_information: newRequestData.notes || '',
      matchedDonor: null,
      progressPercent: 25,
      matchedDonorsCount: matches.length
    };

    setRequests(prev => [requestItem, ...prev]);

    // Dispatch real-time emergency alerts to matched donors
    if (matches.length > 0) {
      matchingService.notifyMatchedDonors(requestItem, matches);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const created = await requestService.createRequest(newRequestData);
        if (created?.id) {
          requestItem.id = created.id;
        }
      } catch (err) {
        console.error('Failed to persist request to Supabase:', err);
      }
    }

    return requestItem;
  };

  // Donor accepts incoming request
  const acceptRequest = async (requestId, donor) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'In Progress - Donor Found',
          request_status: 'Donor Responded',
          matchedDonor: {
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            phone: donor.phone,
            status: 'Confirmed'
          },
          unitsFulfilled: Math.min(req.unitsRequired || 1, (req.unitsFulfilled || 0) + 1),
          units_fulfilled: Math.min(req.unitsRequired || 1, (req.unitsFulfilled || 0) + 1),
          progressPercent: 75
        };
      }
      return req;
    }));

    if (isSupabaseConfigured && donor?.id) {
      await requestService.respondToRequest(requestId, donor.id, 'Accepted');
    }
  };

  // Donor declines incoming request
  const declineRequest = async (requestId, donorId) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
    if (isSupabaseConfigured && donorId) {
      await requestService.respondToRequest(requestId, donorId, 'Declined');
    }
  };

  // Requester or Admin cancels request
  const cancelRequest = async (requestId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'Cancelled', request_status: 'Cancelled', progressPercent: 0 };
      }
      return req;
    }));

    if (isSupabaseConfigured) {
      await requestService.updateStatus(requestId, 'Cancelled');
    }
  };

  // Admin approves or updates status
  const updateRequestStatus = async (requestId, newStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        let progress = 25;
        if (newStatus === 'In Progress - Donor Found' || newStatus === 'Donor Responded') progress = 75;
        if (newStatus === 'Completed' || newStatus === 'Fulfilled') progress = 100;
        if (newStatus === 'Cancelled' || newStatus === 'Expired') progress = 0;
        return { ...req, status: newStatus, request_status: newStatus, progressPercent: progress };
      }
      return req;
    }));

    if (isSupabaseConfigured) {
      await requestService.updateStatus(requestId, newStatus);
    }
  };

  // Admin verifies or flags a donor
  const toggleDonorVerification = async (donorId) => {
    const current = donors.find(d => d.id === donorId);
    const newStatus = current?.isVerified ? 'pending' : 'verified';

    setDonors(prev => prev.map(d => {
      if (d.id === donorId) {
        return { ...d, isVerified: !d.isVerified, verification_status: newStatus };
      }
      return d;
    }));

    if (isSupabaseConfigured) {
      await adminService.setDonorVerification(donorId, newStatus);
    }
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

  // Search donors with multi-criteria filters and geospatial distance
  const searchDonors = useCallback(({ bloodGroup = '', city = '', availabilityOnly = false, searchQuery = '', targetLat, targetLon, maxRadiusKm }) => {
    return donors.filter(donor => {
      if (bloodGroup && bloodGroup !== 'All' && donor.bloodGroup !== bloodGroup && donor.blood_group !== bloodGroup) {
        return false;
      }
      if (city && city !== 'All Cities' && !donor.city.toLowerCase().includes(city.toLowerCase())) {
        return false;
      }
      if (availabilityOnly && !(donor.isAvailable ?? donor.availability)) {
        return false;
      }
      if (targetLat != null && targetLon != null && donor.latitude != null && donor.longitude != null && maxRadiusKm) {
        const dist = calculateDistanceKm(targetLat, targetLon, donor.latitude, donor.longitude);
        if (dist > maxRadiusKm) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = donor.name || donor.full_name || '';
        const donorCity = donor.city || '';
        const blood = donor.bloodGroup || donor.blood_group || '';
        if (!name.toLowerCase().includes(query) && !donorCity.toLowerCase().includes(query) && !blood.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [donors]);

  // Aggregated system stats calculated from real database records
  const fulfilledCount = requests.filter(r => r.status === 'Completed' || r.request_status === 'Fulfilled').length;
  const stats = {
    totalDonors: donors.length,
    activeRequests: requests.filter(r => (r.status === 'Pending' || r.request_status === 'Pending' || r.request_status === 'Matching' || r.status === 'In Progress - Donor Found')).length,
    fulfilledRequests: fulfilledCount,
    criticalRequests: requests.filter(r => (r.priority?.includes('Critical') || r.urgency_level?.includes('Critical')) && r.status !== 'Completed' && r.request_status !== 'Fulfilled').length,
    fulfillmentRate: requests.length > 0 ? `${Math.round((fulfilledCount / requests.length) * 100)}%` : '100%'
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
