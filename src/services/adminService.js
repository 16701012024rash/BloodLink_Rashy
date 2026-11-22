import { supabase, isSupabaseConfigured } from './supabaseClient';

export const adminService = {
  /**
   * Fetch system KPIs
   */
  async getKPIs() {
    if (!isSupabaseConfigured) {
      return {
        totalDonors: 50240,
        activeRequests: 8,
        fulfilledRequests: 10452,
        criticalCases: 3,
        verifiedDonors: 42100,
        pendingVerifications: 14
      };
    }

    const [
      { count: totalDonors },
      { count: activeRequests },
      { count: fulfilledRequests },
      { count: criticalCases },
      { count: pendingVerifications }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'donor'),
      supabase.from('blood_requests').select('*', { count: 'exact', head: true }).in('request_status', ['Pending', 'Matching', 'Donors Notified', 'Donor Responded']),
      supabase.from('blood_requests').select('*', { count: 'exact', head: true }).eq('request_status', 'Fulfilled'),
      supabase.from('blood_requests').select('*', { count: 'exact', head: true }).eq('urgency_level', 'Critical (Golden Hour)'),
      supabase.from('donor_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending')
    ]);

    return {
      totalDonors: totalDonors || 0,
      activeRequests: activeRequests || 0,
      fulfilledRequests: fulfilledRequests || 0,
      criticalCases: criticalCases || 0,
      verifiedDonors: Math.max(0, (totalDonors || 0) - (pendingVerifications || 0)),
      pendingVerifications: pendingVerifications || 0
    };
  },

  /**
   * Admin verifies or flags a donor
   */
  async setDonorVerification(userId, status = 'verified') {
    if (!isSupabaseConfigured) return { userId, status };

    const { data, error } = await supabase
      .from('donor_profiles')
      .update({
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Log admin action in audit_logs
    await this.logAuditAction({
      action: `DONOR_VERIFICATION_${status.toUpperCase()}`,
      resourceType: 'donor_profile',
      resourceId: userId
    });

    return data;
  },

  /**
   * Record action in audit log
   */
  async logAuditAction({ action, resourceType, resourceId, metadata = {} }) {
    if (!isSupabaseConfigured) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata
      });
    } catch (err) {
      console.error('Audit logging failed:', err);
    }
  },

  /**
   * Fetch audit logs
   */
  async getAuditLogs(limit = 50) {
    if (!isSupabaseConfigured) {
      return [
        { id: 'log-1', action: 'DONOR_VERIFIED', resource_type: 'donor_profile', resource_id: 'usr-1', created_at: new Date().toISOString() },
        { id: 'log-2', action: 'EMERGENCY_REQUEST_APPROVED', resource_type: 'blood_requests', resource_id: 'req-1', created_at: new Date().toISOString() }
      ];
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, actor:profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};
