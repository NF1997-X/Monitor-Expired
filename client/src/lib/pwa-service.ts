// Notification service for PWA
export class NotificationService {
  private static instance: NotificationService;
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request permission for notifications
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show notification
  showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      const defaultOptions: NotificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      };

      new Notification(title, defaultOptions);
      
      // Add vibration if supported (mobile devices)
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }

  // Schedule notification for expiring items
  scheduleExpiryNotification(foodItem: string, daysUntilExpiry: number): void {
    if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
      this.showNotification('Food Expiry Warning', {
        body: `${foodItem} expires in ${daysUntilExpiry} day(s)`,
        tag: `expiry-${foodItem}`,
        requireInteraction: true
      });
    } else if (daysUntilExpiry <= 0) {
      this.showNotification('Food Expired!', {
        body: `${foodItem} has expired. Please check and remove if necessary.`,
        tag: `expired-${foodItem}`,
        requireInteraction: true
      });
    }
  }
}

// Background sync for offline data
export class BackgroundSync {
  private static instance: BackgroundSync;
  private pendingData: any[] = [];

  public static getInstance(): BackgroundSync {
    if (!BackgroundSync.instance) {
      BackgroundSync.instance = new BackgroundSync();
    }
    return BackgroundSync.instance;
  }

  // Add data to sync queue
  addToSyncQueue(data: any): void {
    this.pendingData.push(data);
    this.savePendingData();
    
    // Register background sync if service worker is available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Check if background sync is supported
        if ('sync' in window.ServiceWorkerRegistration.prototype) {
          return (registration as any).sync.register('background-sync');
        } else {
          console.log('Background sync not supported');
        }
      }).catch(error => {
        console.log('Background sync registration failed:', error);
      });
    }
  }

  // Save pending data to localStorage
  private savePendingData(): void {
    localStorage.setItem('pwaSyncData', JSON.stringify(this.pendingData));
  }

  // Load pending data from localStorage
  loadPendingData(): any[] {
    const saved = localStorage.getItem('pwaSyncData');
    if (saved) {
      this.pendingData = JSON.parse(saved);
    }
    return this.pendingData;
  }

  // Clear synced data
  clearSyncedData(): void {
    this.pendingData = [];
    localStorage.removeItem('pwaSyncData');
  }
}

// PWA Install Banner
export class InstallBanner {
  private deferredPrompt: any = null;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
    });
  }

  // Show install prompt
  async showInstallPrompt(): Promise<boolean> {
    if (this.deferredPrompt) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      // We no longer need the prompt. Clear it up
      this.deferredPrompt = null;
      
      return outcome === 'accepted';
    }
    return false;
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }
}