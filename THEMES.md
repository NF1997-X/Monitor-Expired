# 🎨 Theme System Documentation

## Available Themes

Monitor-Expired features 6 beautiful iOS-style themes that can be switched on-the-fly:

### 1. 🌙 Dark Glass (Traditional iOS Dark)
- **Best for:** Night time usage, battery saving
- **Colors:** Deep blacks with blue accents
- **Feel:** Classic iOS dark mode with glass morphism

### 2. ☀️ Light Mode (iOS Light)
- **Best for:** Daytime usage, high visibility
- **Colors:** Clean whites with vibrant accents
- **Feel:** Fresh and modern iOS light design

### 3. 🌊 Ocean Theme
- **Best for:** Calm, focused environment
- **Colors:** Deep blues and teals
- **Feel:** Underwater serenity

### 4. 🌅 Sunset Theme
- **Best for:** Creative mood, evening
- **Colors:** Purple, orange, and pink gradients
- **Feel:** Warm and energetic

### 5. 🌲 Forest Theme
- **Best for:** Natural, eco-friendly vibe
- **Colors:** Deep greens and earth tones
- **Feel:** Fresh and organic

### 6. 🌌 Midnight Theme
- **Best for:** Late night work, deep focus
- **Colors:** Deep space blues and purples
- **Feel:** Cosmic and mysterious

## How to Use

1. **Access Theme Picker:**
   - Click the floating 🎨 button at bottom-right
   - Modal opens with all theme previews

2. **Select Theme:**
   - Tap/click on any theme card
   - Theme applies instantly
   - Choice saved to localStorage

3. **Theme Persistence:**
   - Selected theme persists across sessions
   - Syncs across multiple tabs
   - No server-side storage needed

## Technical Details

### Theme Structure
Each theme defines CSS variables for:
- Background colors (primary, secondary)
- Foreground colors (text, icons)
- Accent colors (primary, secondary, destructive)
- Border and input colors
- Chart colors (5 variants)
- Card and popover colors

### Glass Morphism Effects
All themes use iOS-style glass effects:
```css
backdrop-filter: blur(20px) saturate(180%);
```

### Responsive Design
- Mobile-first approach
- Touch-optimized interactions
- Smooth animations (60fps)
- iOS-style haptic feedback (visual)

## Customization

To add a new theme:

1. **Define CSS Variables** in `client/src/index.css`:
```css
.your-theme {
  --background: hsl(...);
  --foreground: hsl(...);
  /* ... other variables */
}
```

2. **Add Theme to Context** in `client/src/context/theme-context.tsx`:
```typescript
type Theme = 'dark-glass' | 'light' | 'ocean' | 'your-theme';
```

3. **Add Theme Option** in `client/src/components/theme-switcher.tsx`:
```typescript
{
  id: 'your-theme',
  name: 'Your Theme',
  description: 'Description',
  preview: 'linear-gradient(...)',
  icon: '🎨',
}
```

## Performance

- Zero runtime overhead
- CSS-only theme switching
- No JavaScript color calculations
- Instant theme application
- Smooth transitions (0.3s cubic-bezier)

## Browser Support

- ✅ Safari (iOS 12+)
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Edge (Chromium)
- ⚠️ Older browsers: Falls back to solid colors

## Tips

1. **Battery Saving:** Use Dark Glass or Midnight themes
2. **Readability:** Light mode in bright environments
3. **Focus:** Ocean or Forest for calm work sessions
4. **Mood:** Sunset for creative tasks
5. **Night:** Midnight for late-night usage

---

**Made with 💙 for iOS lovers**
