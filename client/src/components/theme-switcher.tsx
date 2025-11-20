import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";

const themes = [
  {
    id: 'dark-glass' as const,
    name: 'Dark Glass',
    description: 'Traditional iOS Dark',
    preview: 'linear-gradient(135deg, hsl(240, 10%, 4%), hsl(240, 8%, 6%))',
    icon: '🌙',
  },
  {
    id: 'light' as const,
    name: 'Light',
    description: 'iOS Light Mode',
    preview: 'linear-gradient(135deg, hsl(0, 0%, 98%), hsl(210, 20%, 96%))',
    icon: '☀️',
  },
  {
    id: 'ocean' as const,
    name: 'Ocean',
    description: 'Deep Blue Waters',
    preview: 'linear-gradient(135deg, hsl(200, 25%, 8%), hsl(190, 30%, 12%))',
    icon: '🌊',
  },
  {
    id: 'sunset' as const,
    name: 'Sunset',
    description: 'Purple & Orange',
    preview: 'linear-gradient(135deg, hsl(280, 30%, 8%), hsl(300, 25%, 10%), hsl(25, 40%, 15%))',
    icon: '🌅',
  },
  {
    id: 'forest' as const,
    name: 'Forest',
    description: 'Natural Green',
    preview: 'linear-gradient(135deg, hsl(140, 30%, 6%), hsl(150, 25%, 8%))',
    icon: '🌲',
  },
  {
    id: 'midnight' as const,
    name: 'Midnight',
    description: 'Deep Space Blue',
    preview: 'linear-gradient(135deg, hsl(220, 40%, 5%), hsl(230, 35%, 8%))',
    icon: '🌌',
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Theme Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-4 p-4 glass rounded-full shadow-xl z-40 transition-all duration-300 hover:scale-110 active:scale-95"
        data-testid="theme-switcher-button"
      >
        <Palette className="w-6 h-6 text-primary" />
      </button>

      {/* Theme Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 modal-backdrop"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 glass-dark rounded-3xl p-6 animate-slide-up shadow-2xl max-h-[80vh] overflow-y-auto ios-scroll">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Choose Theme</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pick your favorite style
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setTimeout(() => setIsOpen(false), 300);
                  }}
                  className={`relative p-4 rounded-2xl transition-all duration-300 ${
                    theme === themeOption.id
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: themeOption.preview,
                  }}
                >
                  {/* Check Icon */}
                  {theme === themeOption.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}

                  {/* Theme Info */}
                  <div className="text-left">
                    <div className="text-3xl mb-2">{themeOption.icon}</div>
                    <h4 className="font-semibold text-white text-sm mb-1">
                      {themeOption.name}
                    </h4>
                    <p className="text-xs text-white/70">
                      {themeOption.description}
                    </p>
                  </div>

                  {/* Glass overlay for better readability */}
                  <div className="absolute inset-0 bg-black/20 rounded-2xl -z-10" />
                </button>
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-6 p-4 glass rounded-2xl">
              <p className="text-xs text-center text-muted-foreground">
                🎨 Theme changes apply instantly across all tabs
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
