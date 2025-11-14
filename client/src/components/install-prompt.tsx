import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, X } from "lucide-react";
import { usePWAInstall } from "../hooks/use-pwa-install";

export function InstallPrompt() {
  const { canInstall, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after 3 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if (canInstall && !isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, isDismissed]);

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!canInstall || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">
              Install Monitor Expired
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              Install app to your home screen for quick access and offline use
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-blue-600 hover:bg-blue-700 text-xs"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-slate-300 hover:text-white text-xs"
              >
                Not now
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}