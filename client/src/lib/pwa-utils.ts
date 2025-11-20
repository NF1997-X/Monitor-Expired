// PWA utilities for handling shortcuts and URL parameters
export function handlePWAShortcuts() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');

  switch (action) {
    case 'add':
      // Trigger add food item modal
      setTimeout(() => {
        const addButton = document.querySelector('[data-testid="add-food-button"]') as HTMLButtonElement;
        if (addButton) {
          addButton.click();
        }
      }, 1000);
      break;
      
    case 'calendar':
      // Trigger calendar modal
      setTimeout(() => {
        const calendarButton = document.querySelector('[data-testid="calendar-button"]') as HTMLButtonElement;
        if (calendarButton) {
          calendarButton.click();
        }
      }, 1000);
      break;
      
    default:
      // No action needed
      break;
  }
}

// Check if app is running as PWA
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
}

// Show PWA specific UI elements
export function showPWAElements() {
  if (isPWA()) {
    document.body.classList.add('pwa-mode');
    
    // Hide browser UI elements that don't make sense in PWA
    const browserElements = document.querySelectorAll('.browser-only');
    browserElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  }
}

// Handle share target (when app is shared to)
export function handleShareTarget() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedTitle = urlParams.get('title');
  const sharedText = urlParams.get('text');
  const sharedUrl = urlParams.get('url');

  if (sharedTitle || sharedText || sharedUrl) {
    // Pre-fill add form with shared content
    const content = [sharedTitle, sharedText, sharedUrl].filter(Boolean).join(' ');
    
    // Store in localStorage to be picked up by add form
    localStorage.setItem('sharedContent', content);
    
    // Trigger add modal
    setTimeout(() => {
      const addButton = document.querySelector('[data-testid="add-food-button"]') as HTMLButtonElement;
      if (addButton) {
        addButton.click();
      }
    }, 1000);
  }
}