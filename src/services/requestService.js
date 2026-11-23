import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_REQUESTS } from '../data/mockData';

/**
 * Normalizes a database row or mock object to a standard blood request format
 * so all UI components can reliably access both camelCase and snake_case fields.
 */
export function normalizeBloodRequest(r) {
  if (!r) return null;
  const patient = r.patient_name || r.patient_identifier || r.patientName || 'Patient';
  const hospital = r.hospital_name || r.hospitalName || 'Hospital';
  const address = r.hospital_location || r.hospital_address || r.hospitalAddress || 'Emergency Ward';
  const status = r.request_status || r.status || 'Pending';
  const priority = r.urgency_level || r.priority || 'Critical (Golden Hour)';
  const blood = r.blood_group || r.bloodGroup || 'O+';
  const component = r.component_type || r.componentType || 'Whole Blood';
  const units = parseInt(r.units_required ?? r.unitsRequired ?? 1, 10);
  const unitsDone = parseInt(r.units_fulfilled ?? r.unitsFulfilled ?? 0, 10);
  const phone = r.contact_number || r.contactNumber || r.requester?.phone || '';
  const notes = r.additional_information || r.notes || '';
  const reqEmail = r.requester_email || r.requester?.email || r.requesterEmail || '';
  const reqName = r.requester_name || r.requester?.full_name || r.requesterName || '';

  return {
    ...r,
    id: r.id,
    patientName: patient,
    patient_name: patient,
    patient_identifier: patient,
    hospitalName: hospital,
    hospital_name: hospital,
    hospitalAddress: address,
    hospital_location: address,
    hospital_address: address,
    bloodGroup: blood,
    blood_group: blood,
    componentType: component,
    component_type: component,
    unitsRequired: units,
    units_required: units,
    unitsFulfilled: unitsDone,
    units_fulfilled: unitsDone,
    city: r.city || 'New Delhi',
    roomNumber: r.room_number || r.roomNumber || '',
    room_number: r.room_number || r.roomNumber || '',
    contactNumber: phone,
    contact_number: phone,
    priority: priority,
    urgency_level: priority,
    status: status,
    request_status: status,
    notes: notes,
    additional_information: notes,
    requesterId: r.requester_id || r.requesterId,
    requester_id: r.requester_id || r.requesterId,
    requesterEmail: reqEmail,
    requesterName: reqName,
    createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString() : (r.createdAt || 'Just now'),
    created_at: r.created_at || new Date().toISOString()
  };
}

export const requestService = {
  /**
   * Submit an emergency or standard blood request
   */
  async createRequest(requestData) {
    if (!isSupabaseConfigured) {
      const newReq = normalizeBloodRequest({
        id: `REQ-${Date.now().toString().slice(-4)}`,
        ...requestData,
        status: 'Pending',
        progressPercent: 25,
        createdAt: 'Just now'
      });
      return newReq;
    }

    // Ensure we have authenticated user's ID for RLS compliance
    let requesterId = requestData.requesterId;
    if (!requesterId) {
      const { data: { user } } = await supabase.auth.getUser();
      requesterId = user?.id;
    }

    if (!requesterId) {
      throw new Error('You must be signed in to submit an emergency blood request.');
    }

    const patientName = requestData.patientName || 'Emergency Patient';
    const hospitalName = requestData.hospitalName || 'Hospital';
    const hospitalAddress = requestData.hospitalAddress || 'Emergency Ward';
    const urgency = requestData.priority || requestData.urgency_level || 'Critical (Golden Hour)';
    const notes = requestData.notes || requestData.additional_information || '';

    // Standard schema payload (matches 02_unified_schema.sql)
    const primaryPayload = {
      requester_id: requesterId,
      patient_identifier: patientName,
      blood_group: requestData.bloodGroup,
      component_type: requestData.componentType || 'Whole Blood',
      units_required: parseInt(requestData.unitsRequired || 1, 10),
      hospital_name: hospitalName,
      hospital_address: hospitalAddress,
      city: requestData.city || 'New Delhi',
      contact_number: requestData.contactNumber || '108',
      latitude: Number(requestData.latitude) || 28.6139,
      longitude: Number(requestData.longitude) || 77.2090,
      urgency_level: urgency,
      status: 'Pending',
      notes: notes
    };

    // Alternate schema payload (matches 01_initial_schema.sql)
    const fallbackPayload = {
      requester_id: requesterId,
      patient_name: patientName,
      blood_group: requestData.bloodGroup,
      component_type: requestData.componentType || 'Whole Blood',
      units_required: parseInt(requestData.unitsRequired || 1, 10),
      hospital_name: hospitalName,
      hospital_location: hospitalAddress,
      city: requestData.city || 'New Delhi',
      room_number: requestData.roomNumber || '',
      contact_number: requestData.contactNumber || '108',
      latitude: Number(requestData.latitude) || 28.6139,
      longitude: Number(requestData.longitude) || 77.2090,
      urgency_level: urgency,
      request_status: 'Pending',
      additional_information: notes
    };

    let result = null;
    let insertError = null;

    // 1. Try inserting with primary payload (02_unified_schema)
    const { data: pData, error: pError } = await supabase
      .from('blood_requests')
      .insert(primaryPayload)
      .select('*')
      .single();

    if (!pError && pData) {
      result = pData;
    } else {
      insertError = pError;
      console.warn('[BloodLink] Primary insert failed, trying legacy schema payload:', pError?.message);

      // 2. Fallback to legacy payload (01_initial_schema)
      const { data: fData, error: fError } = await supabase
        .from('blood_requests')
        .insert(fallbackPayload)
        .select('*')
        .single();

      if (!fError && fData) {
        result = fData;
        insertError = null;
      } else {
        insertError = fError;
      }
    }

    if (insertError || !result) {
      console.error('[BloodLink] createRequest Supabase error:', insertError);
      throw new Error(insertError?.message || 'Database error creating blood request');
    }

    return normalizeBloodRequest(result);
  },

  /**
   * Fetch blood requests with flexible filtering
   */
  async getRequests({ status, urgency, city } = {}) {
    if (!isSupabaseConfigured) {
      return INITIAL_REQUESTS.map(normalizeBloodRequest);
    }

    try {
      let query = supabase
        .from('blood_requests')
        .select(`
          *,
          requester:profiles!blood_requests_requester_id_fkey(full_name, email, phone),
          responses:donor_responses(*, donor:profiles!donor_responses_donor_id_fkey(full_name, phone))
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'All') {
        query = query.or(`request_status.eq.${status},status.eq.${status}`);
      }

      if (urgency && urgency !== 'All') {
        query = query.eq('urgency_level', urgency);
      }

      if (city && city !== 'All Cities') {
        query = query.ilike('city', `%${city}%`);
      }

      const { data, error } = await query;
      if (error) {
        // Fallback to plain select without joins if schema relationships vary
        console.warn('[BloodLink] Joined getRequests failed, falling back to simple select:', error.message);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('blood_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        return (fallbackData || []).map(normalizeBloodRequest);
      }

      return (data || []).map(normalizeBloodRequest);
    } catch (err) {
      console.error('[BloodLink] Failed to load blood requests from Supabase:', err);
      return INITIAL_REQUESTS.map(normalizeBloodRequest);
    }
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

    // If accepted, update request status to 'In Progress - Donor Found'
    if (status === 'Accepted') {
      const { error: updErr1 } = await supabase
        .from('blood_requests')
        .update({ status: 'In Progress - Donor Found', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (updErr1) {
        await supabase
          .from('blood_requests')
          .update({ request_status: 'In Progress - Donor Found', updated_at: new Date().toISOString() })
          .eq('id', requestId);
      }
    }

    return data;
  },

  /**
   * Update request status (e.g. by Requester or Admin)
   */
  async updateStatus(requestId, newStatus) {
    if (!isSupabaseConfigured) return { id: requestId, status: newStatus };

    let data = null;
    let error = null;

    const { data: d1, error: e1 } = await supabase
      .from('blood_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select('*')
      .single();

    if (!e1 && d1) {
      data = d1;
    } else {
      const { data: d2, error: e2 } = await supabase
        .from('blood_requests')
        .update({ request_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .select('*')
        .single();

      data = d2;
      error = e2;
    }

    if (error) throw error;
    return normalizeBloodRequest(data);
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
        (payload) => {
          const normalizedPayload = {
            ...payload,
            new: payload.new ? normalizeBloodRequest(payload.new) : null,
            old: payload.old ? normalizeBloodRequest(payload.old) : null,
          };
          callback(normalizedPayload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[BloodLink Realtime] Connected to blood_requests stream');
        }
      });

    return {
      unsubscribe: () => supabase.removeChannel(channel)
    };
  }
};
