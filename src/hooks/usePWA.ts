'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface ServiceWorkerState {
  isInstalled: boolean;
  isInstalling: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface PWAState {
  isOnline: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  serviceWorker: ServiceWorkerState;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isOnline: true,
    isStandalone: false,
    canInstall: false,
    installPrompt: null,
    serviceWorker: {
      isInstalled: false,
      isInstalling: false,
      isUpdateAvailable: false,
      registration: null,
    },
  });

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        serviceWorker: { ...prev.serviceWorker, isInstalling: true },
      }));

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({
                ...prev,
                serviceWorker: { ...prev.serviceWorker, isUpdateAvailable: true },
              }));
            }
          });
        }
      });

      setState(prev => ({
        ...prev,
        serviceWorker: {
          isInstalled: true,
          isInstalling: false,
          isUpdateAvailable: false,
          registration,
        },
      }));
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setState(prev => ({
        ...prev,
        serviceWorker: { ...prev.serviceWorker, isInstalling: false },
      }));
    }
  }, []);

  // Update service worker
  const updateServiceWorker = useCallback(() => {
    if (state.serviceWorker.registration?.waiting) {
      state.serviceWorker.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [state.serviceWorker.registration]);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!state.installPrompt) return;

    try {
      await state.installPrompt.prompt();
      const { outcome } = await state.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed');
        setState(prev => ({ ...prev, canInstall: false, installPrompt: null }));
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  }, [state.installPrompt]);

  // Get cache status from service worker
  const getCacheStatus = useCallback(async () => {
    if (!navigator.serviceWorker.controller) return null;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      navigator.serviceWorker.controller?.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    });
  }, []);

  // Clear all caches
  const clearCaches = useCallback(async () => {
    if (!navigator.serviceWorker.controller) return;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      navigator.serviceWorker.controller?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }, []);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    setState(prev => ({
      ...prev,
      isOnline: navigator.onLine,
      isStandalone,
    }));

    // Handle online/offline events
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setState(prev => ({
        ...prev,
        canInstall: true,
        installPrompt: promptEvent,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Handle successful installation
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        canInstall: false,
        installPrompt: null,
      }));
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    registerServiceWorker();

    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [registerServiceWorker]);

  return {
    ...state,
    installPWA,
    updateServiceWorker,
    getCacheStatus,
    clearCaches,
  };
}

