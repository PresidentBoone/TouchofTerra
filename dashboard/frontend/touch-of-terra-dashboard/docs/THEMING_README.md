# Touch of Terra Dashboard - Theming & Customization Guide

Complete guide for customizing colors, themes, and visual appearance of the dashboard.

## Table of Contents
- [Overview](#overview)
- [Color Palette](#color-palette)
- [Dark Mode](#dark-mode)
- [Tailwind Configuration](#tailwind-configuration)
- [Custom Components](#custom-components)
- [Animations](#animations)
- [Branding](#branding)
- [Responsive Design](#responsive-design)

---

## Overview

The Touch of Terra Dashboard uses a combination of Tailwind CSS and custom styles to create a warm, compassionate, and professional appearance. The design system is built with accessibility and flexibility in mind.

### Design Philosophy
- **Warm & Welcoming**: Earth tones and gradients
- **Professional**: Clean lines and clear hierarchy
- **Accessible**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first approach

---

## Color Palette

### Primary Colors (Touch of Terra Brand)

Located in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary Touch of Terra Colors
        'tot-primary': '#7BA05B',      // Primary Green
        'tot-primary-light': '#9BC177', // Light Green
        'tot-sage': '#A8B89C',          // Sage Green
        'tot-teal': '#5D8A7A',          // Teal
        'tot-teal-dark': '#4A6B5D',     // Dark Teal
        'tot-beige': '#F5F2E8',         // Beige
        'tot-warm-beige': '#EDE7D9',    // Warm Beige
        'tot-brown': '#B8A082',         // Soft Brown

        // Gradient Palette (as specified)
        'tot-gradient-start': '#2a357a',  // Deep purple/blue
        'tot-gradient-mid': '#f3e6ff',    // Light lavender
        'tot-gradient-end': '#2a357a',    // Back to deep purple/blue
      },
    },
  },
};
```

### Semantic Colors

```javascript
colors: {
  // Status Colors
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Orange
  error: '#ef4444',      // Red
  info: '#3b82f6',       // Blue

  // Chart Colors
  'chart-primary': '#3b82f6',
  'chart-secondary': '#10b981',
  'chart-tertiary': '#f59e0b',
  'chart-quaternary': '#9333ea',
}
```

### Usage Example

```jsx
// Using Touch of Terra brand colors
<div className="bg-tot-primary text-white p-4 rounded-lg">
  <h2 className="text-tot-beige">Branded Component</h2>
</div>

// Using semantic colors
<button className="bg-success hover:bg-success/90">
  Save
</button>

// Using gradient
<div className="bg-gradient-to-r from-tot-gradient-start via-tot-gradient-mid to-tot-gradient-end">
  Gradient Background
</div>
```

---

## Dark Mode

### Implementation

Dark mode is implemented using Tailwind's `dark:` prefix and persisted in localStorage.

**Hook**: `src/hooks/useTheme.js`

```javascript
import { useTheme } from '../hooks/useTheme';

function Component() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Toggle to {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

### Color Adjustments for Dark Mode

```jsx
// Automatic dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content adapts to theme
</div>

// Opacity adjustments
<p className="text-gray-600 dark:text-gray-400">
  Subtle text
</p>

// Border colors
<div className="border border-gray-200 dark:border-gray-700">
  Bordered element
</div>
```

### Dark Mode Specific Features

**Star Background** (only visible in dark mode):
```jsx
import StarsBackground from './components/StarsBackground';

function App() {
  return (
    <>
      <StarsBackground starCount={100} />
      {/* Other content */}
    </>
  );
}
```

**Gradients**:
- Light mode: Vibrant, high contrast
- Dark mode: Muted, lower contrast

```css
.gradient-bg {
  background: linear-gradient(to right, #3b82f6, #10b981);
}

.dark .gradient-bg {
  background: linear-gradient(to right, #1e40af, #047857);
}
```

---

## Tailwind Configuration

### Full Configuration

Located in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Touch of Terra brand colors
        'tot-primary': '#7BA05B',
        'tot-primary-light': '#9BC177',
        'tot-sage': '#A8B89C',
        'tot-teal': '#5D8A7A',
        'tot-teal-dark': '#4A6B5D',
        'tot-beige': '#F5F2E8',
        'tot-warm-beige': '#EDE7D9',
        'tot-brown': '#B8A082',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tot-light': '0 2px 8px rgba(123, 160, 91, 0.1)',
        'tot-medium': '0 4px 16px rgba(123, 160, 91, 0.15)',
        'tot-large': '0 8px 32px rgba(123, 160, 91, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

### Adding Custom Colors

1. Edit `tailwind.config.js`
2. Add color to `theme.extend.colors`
3. Use in components: `className="bg-your-color"`

---

## Custom Components

### Styled Button Component

```jsx
// src/components/ui/Button.jsx
const Button = ({ variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-tot-primary hover:bg-tot-primary-light text-white',
    secondary: 'bg-tot-teal hover:bg-tot-teal-dark text-white',
    outline: 'border-2 border-tot-primary text-tot-primary hover:bg-tot-primary hover:text-white',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Card Component

```jsx
// src/components/ui/Card.jsx
const Card = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white dark:bg-gray-800
      rounded-xl shadow-tot-medium
      p-6
      border border-gray-100 dark:border-gray-700
      transition-all duration-300
      hover:shadow-tot-large
      ${className}
    `}>
      {children}
    </div>
  );
};
```

---

## Animations

### Built-in Animations

Located in `src/styles/animations.css`:

**Available Animations**:
- `fade-in`: Fade in element
- `slide-in-up`: Slide up and fade in
- `slide-in-right`: Slide from right
- `scale-in`: Scale up and fade in
- `pulse`: Pulse effect
- `twinkle`: Star twinkle (dark mode)

**Usage**:
```jsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-up">Slides up</div>
<div className="animate-scale-in">Scales in</div>
```

### Custom Animations

**Define in CSS**:
```css
@keyframes custom-animation {
  0% { /* start state */ }
  100% { /* end state */ }
}

.custom-animate {
  animation: custom-animation 1s ease-out;
}
```

**Use in Tailwind config**:
```javascript
animation: {
  'custom': 'custom-animation 1s ease-out',
}
```

### Animation Best Practices

```jsx
// Accessibility: Respect prefers-reduced-motion
<div className="
  motion-safe:animate-fade-in
  motion-reduce:opacity-100
">
  Content
</div>

// Conditional animation
const [isAnimating, setIsAnimating] = useState(false);
<div className={isAnimating ? 'animate-pulse' : ''}>
  Content
</div>
```

---

## Branding

### Logo

**Location**: `public/logo.png`

**Usage**:
```jsx
<img
  src="/logo.png"
  alt="Touch of Terra Logo"
  className="h-12 w-auto"
/>
```

**Responsive Sizing**:
```jsx
<img
  src="/logo.png"
  alt="Touch of Terra Logo"
  className="h-8 sm:h-10 md:h-12 w-auto"
/>
```

### Typography

**Font Family**: Inter (Google Fonts)

Loaded in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Font Scale**:
```jsx
<h1 className="text-4xl font-bold">Heading 1</h1>
<h2 className="text-3xl font-bold">Heading 2</h2>
<h3 className="text-2xl font-semibold">Heading 3</h3>
<p className="text-base">Body text</p>
<small className="text-sm">Small text</small>
```

### Brand Voice

**Tone**: Compassionate, professional, action-oriented

**Messaging**:
- "Carrying compassion, one backpack at a time"
- Focus on dignity and hope
- Action-oriented language ("Help Now", "Get Involved")

---

## Responsive Design

### Breakpoints

```javascript
// Tailwind default breakpoints
sm: '640px'   // Tablet
md: '768px'   // Small laptop
lg: '1024px'  // Laptop
xl: '1280px'  // Desktop
2xl: '1536px' // Large desktop
```

### Responsive Utilities

```jsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Responsive text size
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

### Mobile-First Approach

```jsx
// Base styles are mobile
// Add larger screen styles with prefixes
<div className="
  p-4          // Mobile (base)
  md:p-6       // Tablet and up
  lg:p-8       // Desktop and up
">
  Content
</div>
```

---

## Customization Examples

### Change Primary Color

**1. Update Tailwind Config**:
```javascript
colors: {
  'tot-primary': '#YOUR_NEW_COLOR',
}
```

**2. Update CSS Variables** (if using):
```css
:root {
  --color-primary: YOUR_NEW_COLOR;
}
```

**3. Rebuild**:
```bash
npm run build
```

### Add New Theme Variant

**Create new theme in useTheme hook**:
```javascript
const themes = {
  light: 'light',
  dark: 'dark',
  highContrast: 'high-contrast', // NEW
};

const setTheme = (newTheme) => {
  document.documentElement.classList.remove('light', 'dark', 'high-contrast');
  document.documentElement.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
};
```

**Add styles for new theme**:
```css
.high-contrast .bg-primary {
  background-color: #000;
  color: #fff;
}
```

### Customize Component Styles

**Option 1: Extend Tailwind classes**:
```jsx
<Component className="your-custom-classes" />
```

**Option 2: Create styled variant**:
```jsx
const StyledComponent = ({ variant }) => {
  const styles = {
    default: 'bg-white text-black',
    custom: 'bg-tot-primary text-white',
  };

  return <div className={styles[variant]} />;
};
```

---

## Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum

**Test contrast**:
```bash
npm install -g pa11y
pa11y http://localhost:5174
```

### Focus States

```jsx
// Always include focus styles
<button className="
  bg-primary
  focus:ring-2 focus:ring-offset-2 focus:ring-primary
  focus:outline-none
">
  Accessible Button
</button>
```

### Screen Reader Support

```jsx
// Use semantic HTML
<button aria-label="Close menu">
  <i className="fas fa-times" aria-hidden="true" />
</button>

// Provide text alternatives
<img src="/chart.png" alt="Homelessness trends chart showing increase" />
```

---

## Support

For theming questions:
- **Email**: touchofterralouisville@gmail.com
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Design System**: See components in `/src/components`

---

**Last Updated**: January 2025
**Version**: 1.0.0
