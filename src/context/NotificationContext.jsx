import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { notificationService } from '../services/notificationService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('bloodlink_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('bloodlink_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read && !n.is_read).length;

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, is_read: true } : n));
    if (isSupabaseConfigured) {
      await notificationService.markAsRead(id);
    }
  };

  const markAllAsRead = async (userId) => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })));
    if (isSupabaseConfigured && userId) {
      await notificationService.markAllAsRead(userId);
    }
  };

  const addNotification = ({ title, message, type = 'update', urgent = false, actionUrl = '#' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      notification_type: type,
      urgent,
      actionUrl,
      action_url: actionUrl,
      timestamp: 'Just now',
      created_at: new Date().toISOString(),
      read: false,
      is_read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(title, type);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showToast = (message, type = 'success') => {
    const toastId = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
