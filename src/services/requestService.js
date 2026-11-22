import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_REQUESTS } from '../data/mockData';

export const requestService = {
  /**
   * Submit an emergency or standard blood request
   */
  async createRequest(requestData) {
    if (!isSupabaseConfigured) {
      const newReq = {
        id: `REQ-${Date.now().toString().slice(-4)}`,
        ...requestData,
        status: 'Pending',
        progressPercent: 25,
        createdAt: 'Just now'
      };
      return newReq;
    }

    const { data, error } = await supabase
      .from('blood_requests')
      .insert({
        requester_id: requestData.requesterId,
        patient_name: requestData.patientName,
        blood_group: requestData.bloodGroup,
        component_type: requestData.componentType || 'Whole Blood',
        units_required: parseInt(requestData.unitsRequired || 1, 10),
        hospital_name: requestData.hospitalName,
        hospital_location: requestData.hospitalAddress,
        city: requestData.city || 'New Delhi',
        room_number: requestData.roomNumber || '',
        contact_number: requestData.contactNumber,
        latitude: requestData.latitude || 28.6139,
        longitude: requestData.longitude || 77.2090,
        urgency_level: requestData.priority || 'Critical (Golden Hour)',
        additional_information: requestData.notes || '',
        request_status: 'Pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch blood requests
   */
  async getRequests({ status, urgency, city } = {}) {
    if (!isSupabaseConfigured) {
      return INITIAL_REQUESTS;
    }

    let query = supabase
      .from('blood_requests')
      .select(`
        *,
        requester:profiles!blood_requests_requester_id_fkey(full_name, email, phone),
        responses:donor_responses(*, donor:profiles!donor_responses_donor_id_fkey(full_name, phone))
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('request_status', status);
    }

    if (urgency && urgency !== 'All') {
      query = query.eq('urgency_level', urgency);
    }

    if (city && city !== 'All Cities') {
      query = query.ilike('city', `%${city}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Donor responds to a request (Accepted / Declined)
   */
  async respondToRequest(requestId, donorId, status = 'Accepted', notes = '') {
    if (!isSupabaseConfigured) {
      return { requestId, donorId, status };
    }

    const { data, error } = await supabase
      .from('donor_responses')
      .upsert({
        request_id: requestId,
        donor_id: donorId,
        response_status: status,
        notes,
        responded_at: new Date().toISOString()
      }, { onConflict: 'request_id,donor_id' })
      .select()
      .single();

    if (error) throw error;

    // If accepted, update request status to 'Donor Responded'
    if (status === 'Accepted') {
      await supabase
        .from('blood_requests')
        .update({
          request_status: 'Donor Responded',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
    }

    return data;
  },

  /**
   * Update request status (e.g. by Requester or Admin)
   */
  async updateStatus(requestId, newStatus) {
    if (!isSupabaseConfigured) return { id: requestId, status: newStatus };

    const { data, error } = await supabase
      .from('blood_requests')
      .update({ request_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Subscribe to real-time changes on blood_requests table
   */
  subscribeToRequests(callback) {
    if (!isSupabaseConfigured) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('realtime:blood_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_requests' },
        (payload) => callback(payload)
      )
      .subscribe();

    return {
      unsubscribe: () => supabase.removeChannel(channel)
    };
  }
};
