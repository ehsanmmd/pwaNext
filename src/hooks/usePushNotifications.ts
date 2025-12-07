'use client';

import { useState, useEffect, useCallback } from 'react';

interface PushState {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  isSubscribing: boolean;
  error: string | null;
}

// Convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushState>({
    isSupported: false,
    permission: 'default',
    subscription: null,
    isSubscribing: false,
    error: null,
  });

  // Check support and get existing subscription
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 
        'serviceWorker' in navigator && 
        'PushManager' in window && 
        'Notification' in window;

      if (!isSupported) {
        setState(prev => ({ ...prev, isSupported: false }));
        return;
      }

      setState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
      }));

      // Get existing subscription
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setState(prev => ({ ...prev, subscription }));
      } catch (error) {
        console.error('Error getting subscription:', error);
      }
    };

    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }, [state.isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Push notifications not supported' }));
      return null;
    }

    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        setState(prev => ({ ...prev, error: 'Permission denied' }));
        return null;
      }
    }

    setState(prev => ({ ...prev, isSubscribing: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from server
      const response = await fetch('/api/push/vapid-public-key');
      const { publicKey } = await response.json();

      if (!publicKey) {
        throw new Error('VAPID public key not configured');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      setState(prev => ({
        ...prev,
        subscription,
        isSubscribing: false,
      }));

      return subscription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription failed';
      console.error('Error subscribing:', error);
      setState(prev => ({
        ...prev,
        isSubscribing: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [state.isSupported, state.permission, requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;

    try {
      // Notify server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: state.subscription.endpoint }),
      });

      await state.subscription.unsubscribe();
      setState(prev => ({ ...prev, subscription: null }));
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  }, [state.subscription]);

  // Send a test notification
  const sendTestNotification = useCallback(async (options?: {
    title?: string;
    body?: string;
    icon?: string;
    url?: string;
  }) => {
    if (!state.subscription) {
      setState(prev => ({ ...prev, error: 'Not subscribed' }));
      return false;
    }

    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: state.subscription.endpoint,
          title: options?.title || 'Test Notification',
          body: options?.body || 'This is a test push notification!',
          icon: options?.icon || '/icons/icon-192x192.png',
          url: options?.url || '/',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }, [state.subscription]);

  // Show local notification (without push)
  const showLocalNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!state.isSupported) return false;

    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/badge-72x72.svg',
        ...options,
      });
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }, [state.isSupported, state.permission, requestPermission]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    showLocalNotification,
  };
}

