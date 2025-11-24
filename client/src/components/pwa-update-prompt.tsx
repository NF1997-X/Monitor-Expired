import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Check for updates every 60 seconds
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update();
        });
      }, 60000);

      // Listen for updates
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                setRegistration(reg);
                setShowPrompt(true);
              }
            });
          }
        });
      });

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isUpdating) {
          window.location.reload();
        }
      });

      return () => clearInterval(interval);
    }
  }, [isUpdating]);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      setIsUpdating(true);
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
      <div className="glass-dark rounded-2xl p-4 shadow-2xl border border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Update Available</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                A new version of the app is ready
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleUpdate}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Now
              </>
            )}
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            className="px-4"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}
