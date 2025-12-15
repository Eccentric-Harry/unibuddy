# Dark Theme Implementation Guide

## Overview

UniBuddy now supports a comprehensive dark theme system with automatic system preference detection and manual theme switching. The implementation uses Tailwind CSS's class-based dark mode strategy.

## Architecture

### Core Components

1. **ThemeProvider** (`src/lib/theme.tsx`)
   - Provides theme context to the entire application
   - Manages theme state and persistence
   - Listens to system preference changes
   - Updates the HTML element class and meta theme-color

2. **ThemeToggle** (`src/components/ThemeToggle.tsx`)
   - User-facing theme switcher component
   - Two variants: `compact` (icon only) and `expanded` (all options)
   - Fully accessible with ARIA attributes

### Theme Modes

- **light**: Force light theme
- **dark**: Force dark theme
- **system**: Automatically follow OS preference (default)

## Usage

### Using the Theme Hook

```tsx
import { useTheme } from '../lib/theme';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  // Get current theme setting ('light' | 'dark' | 'system')
  console.log(theme);
  
  // Get actual resolved theme ('light' | 'dark')
  console.log(resolvedTheme);
  
  // Set theme explicitly
  setTheme('dark');
  
  // Toggle between light and dark
  toggleTheme();
}
```

### Adding ThemeToggle to Components

**Compact variant (icon only):**
```tsx
import { ThemeToggle } from '../components/ThemeToggle';

function Header() {
  return (
    <nav>
      {/* Other nav items */}
      <ThemeToggle variant="compact" />
    </nav>
  );
}
```

**Expanded variant (all options):**
```tsx
<ThemeToggle variant="expanded" className="my-custom-class" />
```

### Adding Dark Mode Variants to Components

When creating or updating components, add dark mode variants using Tailwind's `dark:` prefix:

```tsx
// Basic text and background
<div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  
// Borders and shadows
<div className="border-gray-200 dark:border-gray-700 shadow-md dark:shadow-xl">

// Status badges
<span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">

// Gradients
<div className="bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 
               dark:from-violet-800 dark:via-purple-700 dark:to-fuchsia-700">
```

## Implementation Checklist for New Components

- [ ] Add `dark:` variants for backgrounds
- [ ] Add `dark:` variants for text colors
- [ ] Add `dark:` variants for borders
- [ ] Add `dark:` variants for shadows
- [ ] Test with both light and dark themes
- [ ] Verify color contrast meets WCAG standards
- [ ] Check that images/icons work in both modes

## Color Palette Guidelines

### Light Mode
- Background: `bg-white`, `bg-gray-50`, `bg-gray-100`
- Text: `text-gray-900`, `text-gray-700`, `text-gray-600`
- Borders: `border-gray-200`, `border-gray-300`

### Dark Mode
- Background: `dark:bg-slate-950`, `dark:bg-slate-900`, `dark:bg-slate-800`
- Text: `dark:text-gray-100`, `dark:text-gray-200`, `dark:text-gray-300`
- Borders: `dark:border-gray-700`, `dark:border-gray-600`

## Accessibility

- All theme toggles include proper ARIA labels
- The `theme-transition` class respects `prefers-reduced-motion`
- Color contrast ratios meet WCAG AA standards
- Keyboard navigation fully supported

## Persistence

Theme preference is stored in `localStorage` under the key `cb_theme`. This ensures the user's choice persists across sessions.

## System Integration

- **Meta Theme Color**: Automatically updates `<meta name="theme-color">` to match the active theme
  - Light: `#ffffff`
  - Dark: `#0f172a`
- **Scrollbar**: Custom scrollbar colors adapt to theme
- **Reduced Motion**: Respects user's motion preferences

## Testing

Run the development server and test:
```bash
npm run dev
```

### Manual Testing Checklist
- [ ] Toggle between light/dark modes
- [ ] Verify localStorage persistence (refresh page)
- [ ] Test system preference change detection
- [ ] Check mobile appearance (meta theme-color)
- [ ] Verify transitions are smooth
- [ ] Test with reduced motion enabled
- [ ] Check all updated components (Hero, ListingCard)

## Examples

### Updated Components

1. **Hero Component** (`src/components/dashboard/Hero.tsx`)
   - Gradient backgrounds with dark variants
   - Search bar with dark mode styling
   - Text color adjustments

2. **ListingCard Component** (`src/components/marketplace/ListingCard.tsx`)
   - Status badges with dark variants
   - Card content text colors
   - Category badges

## Troubleshooting

**Theme not persisting:**
- Check that `ThemeProvider` wraps your app in `main.tsx`
- Verify localStorage is enabled in browser

**Dark mode not applying:**
- Ensure `darkMode: 'class'` is set in `tailwind.config.js`
- Check that `dark:` classes are properly added
- Verify HTML element has `dark` class in DevTools

**Transitions not working:**
- Add `theme-transition` class to animated elements
- Check that reduced motion is not enabled if transitions expected

## Future Enhancements

- [ ] Add theme-specific images/illustrations
- [ ] Implement per-page theme overrides
- [ ] Add animation preferences
- [ ] Create theme preview component
- [ ] Add custom color scheme creator

