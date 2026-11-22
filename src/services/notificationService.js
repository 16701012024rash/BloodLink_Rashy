import { supabase, isSupabaseConfigured } from './supabaseClient';

export const notificationService = {
  /**
   * Fetch notifications for a user
   */
  async getNotifications(userId) {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('bloodlink_notifications');
      return saved ? JSON.parse(saved) : [];
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Create an in-app notification record and trigger external delivery if configured
   */
  async createNotification({ userId, title, message, type = 'emergency', actionUrl = '' }) {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('bloodlink_notifications');
      const current = saved ? JSON.parse(saved) : [];
      const newNotif = {
        id: `notif-${Date.now()}`,
        user_id: userId,
        title,
        message,
        notification_type: type,
        is_read: false,
        action_url: actionUrl,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('bloodlink_notifications', JSON.stringify([newNotif, ...current]));
      return newNotif;
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        notification_type: type,
        is_read: false,
        action_url: actionUrl
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId) {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('bloodlink_notifications');
      if (saved) {
        const list = JSON.parse(saved).map(n => n.id === notificationId ? { ...n, is_read: true } : n);
        localStorage.setItem('bloodlink_notifications', JSON.stringify(list));
      }
      return { id: notificationId, is_read: true };
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('bloodlink_notifications');
      if (saved) {
        const list = JSON.parse(saved).map(n => ({ ...n, is_read: true }));
        localStorage.setItem('bloodlink_notifications', JSON.stringify(list));
      }
      return true;
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  /**
   * Subscribe to real-time notification changes
   */
  subscribeToNotifications(userId, callback) {
    if (!isSupabaseConfigured || !userId) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel(`realtime:notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();

    return {
      unsubscribe: () => supabase.removeChannel(channel)
    };
  },

  /**
   * Check status of external providers (SMS / FCM)
   */
  getProviderStatus() {
    const hasFCM = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
    return {
      supabaseRealtime: isSupabaseConfigured,
      webPushFCM: hasFCM,
      smsGatewayConfigured: false // Protected on backend Edge Function
    };
  }
};
