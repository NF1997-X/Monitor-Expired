import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { NotificationService } from "./lib/pwa-service";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      
      // Request notification permission
      const notificationService = NotificationService.getInstance();
      await notificationService.requestPermission();
      
      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  });
}

// Handle PWA install prompt
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Listen for app installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
});

createRoot(document.getElementById("root")!).render(<App />);
