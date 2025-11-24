// PWA Service Worker Registration and Management
export const APP_VERSION = '1.3.0';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration);
          
          // Check for updates on load
          registration.update();
          
          // Check for updates periodically (every 5 minutes)
          setInterval(() => {
            registration.update();
          }, 5 * 60 * 1000);
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('[PWA] Error unregistering service worker:', error);
      });
  }
}

export async function getServiceWorkerVersion(): Promise<string | null> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      const controller = navigator.serviceWorker.controller;
      
      if (!controller) {
        resolve(null);
        return;
      }
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data && event.data.version) {
          resolve(event.data.version);
        } else {
          resolve(null);
        }
      };
      
      controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
      
      // Timeout after 2 seconds
      setTimeout(() => resolve(null), 2000);
    });
  }
  return null;
}

export function checkOnlineStatus(): boolean {
  return navigator.onLine;
}

export function addOnlineListener(callback: () => void) {
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

export function addOfflineListener(callback: () => void) {
  window.addEventListener('offline', callback);
  return () => window.removeEventListener('offline', callback);
}
