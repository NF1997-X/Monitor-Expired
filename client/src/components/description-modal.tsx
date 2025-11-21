import { X, Check, Bell, Trash2, Calendar, BarChart3, Settings, Utensils } from "lucide-react";

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DescriptionModal({ isOpen, onClose }: DescriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 animate-fade-in" data-testid="description-modal">
      <div className="glass-dark rounded-lg p-6 m-4 w-full max-w-md animate-slide-up max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">ℹ️</span>
            <h3 className="text-lg font-semibold">About This App</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-white/10"
            data-testid="close-description-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="glass rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span>🍱</span>
              <span>Track Food Expiration</span>
            </h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Keep track of your food items and their expiration dates to reduce waste and stay organized.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-semibold flex items-center gap-2">
              <span>✨</span>
              <span>Key Features</span>
            </h4>
            
            <div className="glass rounded-lg p-3 flex items-start space-x-3 hover:bg-white/5 transition-colors">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">Smart Notifications</span>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                  Get alerts 15, 8, and 3 days before items expire
                </p>
              </div>
            </div>

            <div className="glass rounded-lg p-3 flex items-start space-x-3 hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">Browser Notifications</span>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                  Receive push notifications even when app is closed
                </p>
              </div>
            </div>

            <div className="glass rounded-lg p-3 flex items-start space-x-3 hover:bg-white/5 transition-colors">
              <Trash2 className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">Auto-Delete Expired</span>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                  Automatically move expired items to trash (can be disabled)
                </p>
              </div>
            </div>

            <div className="glass rounded-lg p-3 flex items-start space-x-3 hover:bg-white/5 transition-colors">
              <Calendar className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">Calendar View</span>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                  View all expiring items in a monthly calendar with swipe gestures
                </p>
              </div>
            </div>

            <div className="glass rounded-lg p-3 flex items-start space-x-3 hover:bg-white/5 transition-colors">
              <BarChart3 className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">Statistics</span>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                  Track your food waste patterns and category breakdowns
                </p>
              </div>
            </div>

            <div className="glass rounded-lg p-3 flex items-start space-x-3 hover:bg-white/5 transition-colors">
              <Settings className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-xs">Customizable Settings</span>
                <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">
                  Configure notifications, themes, and auto-delete preferences
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-xs flex items-center gap-2">
              <span>📂</span>
              <span>Categories</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-transparent border border-transparent">LSSD</span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-transparent border border-transparent">RTE</span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-transparent border border-transparent">GM</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={onClose}
            className="w-full px-4 py-3 glass border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
            data-testid="close-description-button"
          >
            ✅ Got it!
          </button>
        </div>
      </div>
    </div>
  );
}