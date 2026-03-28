// stores/notifications.ts

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/axios';

interface Notification {
  id: number;
  notification_type: 'achievement' | 'assignment_completed' | 'feedback_received' | 'profile_updated';
  title: string;
  message: string;
  achievement: number | null;
  assignment: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  read_at: string | null;
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const lastChecked = ref<Date | null>(null);
  const checkTimeout = ref<number | null>(null);
  
  // Get unread notifications
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.is_read && !n.is_dismissed);
  });
  
  // Fetch unread notifications
  async function fetchUnread() {
    try {
      const response = await api.get<Notification[]>('/notifications/unread/');
      notifications.value = response.data;
      unreadCount.value = response.data.length;
      lastChecked.value = new Date();
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }
  
  // Fetch recent notifications (for notification center)
  async function fetchRecent() {
    try {
      const response = await api.get<Notification[]>('/notifications/recent/');
      notifications.value = response.data;
      unreadCount.value = response.data.filter(n => !n.is_read).length;
      lastChecked.value = new Date();
    } catch (error) {
      console.error('Failed to fetch recent notifications:', error);
    }
  }
  
  // Mark notification as read
  async function markAsRead(notificationId: number) {
    try {
      await api.post(`/notifications/${notificationId}/mark_read/`);
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
        notification.read_at = new Date().toISOString();
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
  
  // Dismiss notification
  async function dismiss(notificationId: number) {
    try {
      await api.post(`/notifications/${notificationId}/dismiss/`);
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const wasUnread = !notifications.value[index].is_read;
        notifications.value.splice(index, 1);
        if (wasUnread) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  }
  
  // Mark all as read
  async function markAllAsRead() {
    try {
      await api.post('/notifications/mark_all_read/');
      notifications.value.forEach(n => {
        n.is_read = true;
        n.read_at = new Date().toISOString();
      });
      unreadCount.value = 0;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }
  
  /**
   * Schedule a notification check after a delay.
   * Useful for checking after completing activities.
   * @param delayMs - Delay in milliseconds (default: 10000 = 10 seconds)
   */
  function scheduleCheck(delayMs: number = 10000) {
    // Clear any existing scheduled check
    if (checkTimeout.value) {
      clearTimeout(checkTimeout.value);
    }
    
    console.log(`Scheduling notification check in ${delayMs / 1000} seconds...`);
    
    checkTimeout.value = window.setTimeout(() => {
      console.log('Checking for new notifications...');
      fetchUnread();
      checkTimeout.value = null;
    }, delayMs);
  }
  
  /**
   * Check for notifications immediately.
   * Useful when navigating to dashboard or important pages.
   */
  function checkNow() {
    console.log('Checking for notifications now...');
    fetchUnread();
  }
  
  /**
   * Cancel any scheduled notification check.
   */
  function cancelScheduledCheck() {
    if (checkTimeout.value) {
      clearTimeout(checkTimeout.value);
      checkTimeout.value = null;
    }
  }
  
  return {
    notifications,
    unreadCount,
    unreadNotifications,
    lastChecked,
    fetchUnread,
    fetchRecent,
    markAsRead,
    dismiss,
    markAllAsRead,
    scheduleCheck,
    checkNow,
    cancelScheduledCheck,
  };
});