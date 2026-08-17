# Accessibility Compliance Guide

This guide outlines the accessibility standards and practices implemented in this portfolio project to ensure WCAG 2.1 Level AA compliance.

## Table of Contents

- [Overview](#overview)
- [WCAG 2.1 Principles](#wcag-21-principles)
- [Semantic HTML](#semantic-html)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Reader Support](#screen-reader-support)
- [Color Contrast](#color-contrast)
- [Forms & Input](#forms--input)
- [Images & Media](#images--media)
- [Focus Management](#focus-management)
- [Testing](#testing)
- [Checklist](#checklist)

## Overview

This portfolio aims to meet WCAG 2.1 Level AA standards, ensuring the site is accessible to users with various disabilities including:

- Visual impairments (blindness, low vision, color blindness)
- Motor impairments (limited dexterity, tremor)
- Auditory impairments (deafness, hearing loss)
- Cognitive impairments (learning disabilities, attention disorders)

## WCAG 2.1 Principles

### 1. Perceivable
Information and user interface components must be presentable to users in ways they can perceive.

**Implementation:**
- Text alternatives for non-text content
- Captions and alternatives for multimedia
- Content adaptable to different presentations
- Sufficient color contrast

### 2. Operable
User interface components and navigation must be operable.

**Implementation:**
- All functionality available via keyboard
- Users have enough time to read and use content
- Content does not cause seizures
- Navigable and findable content

### 3. Understandable
Information and operation of user interface must be understandable.

**Implementation:**
- Readable and predictable text
- Input assistance and error prevention
- Consistent navigation patterns

### 4. Robust
Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

**Implementation:**
- Valid HTML markup
- Compatible with current and future assistive technologies
- Proper ARIA attributes

## Semantic HTML

### Proper Document Structure

```tsx
// ✅ Good: Semantic HTML structure
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2026 Portfolio</p>
</footer>
```

### Heading Hierarchy

```tsx
// ✅ Good: Proper heading hierarchy
<h1>Page Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection</h3>
</section>

// ❌ Bad: Skipping heading levels
<h1>Page Title</h1>
<h3>Section Title</h3> // Skipped h2
```

### Landmark Regions

```tsx
<body>
  <header role="banner">
    {/* Site header */}
  </header>
  
  <nav role="navigation" aria-label="Main navigation">
    {/* Primary navigation */}
  </nav>
  
  <main role="main">
    {/* Main content */}
  </main>
  
  <aside role="complementary">
    {/* Sidebar content */}
  </aside>
  
  <footer role="contentinfo">
    {/* Site footer */}
  </footer>
</body>
```

## Keyboard Navigation

### Focus Indicators

```css
/* Ensure visible focus indicators */
*:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Custom focus styles */
.button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.2);
}
```

### Tab Order

```tsx
// Ensure logical tab order
<nav>
  <a href="/" tabIndex={0}>Home</a>
  <a href="/about" tabIndex={0}>About</a>
  <a href="/contact" tabIndex={0}>Contact</a>
</nav>

// Skip to main content link
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

```css
/* Skip link styles */
.skip-to-main {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.skip-to-main:focus {
  left: 0;
  top: 0;
  padding: 1rem;
  background: #000;
  color: #fff;
}
```

### Keyboard Event Handlers

```tsx
// Support both mouse and keyboard interactions
function Button({ onClick, children }) {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyPress={handleKeyPress}
      type="button"
    >
      {children}
    </button>
  );
}
```

### Focus Trapping in Modals

```tsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element in modal
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    } else {
      // Restore focus when modal closes
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
    
    // Trap focus within modal
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

## Screen Reader Support

### ARIA Labels

```tsx
// Provide accessible names for interactive elements
<button aria-label="Close menu">
  <X /> {/* Icon only */}
</button>

// Describe the purpose of links
<a href="/download" aria-label="Download resume (PDF, 2MB)">
  Download
</a>

// Label navigation regions
<nav aria-label="Main navigation">
  {/* Navigation links */}
</nav>

<nav aria-label="Social media links">
  {/* Social links */}
</nav>
```

### ARIA Live Regions

```tsx
// Announce dynamic content changes
function StatusMessage({ message, type }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`status-${type}`}
    >
      {message}
    </div>
  );
}

// For urgent announcements
function ErrorMessage({ error }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {error}
    </div>
  );
}
```

### ARIA States

```tsx
// Expandable sections
function Accordion({ title, children, isOpen, onToggle }) {
  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls="content-1"
        onClick={onToggle}
      >
        {title}
      </button>
      <div
        id="content-1"
        hidden={!isOpen}
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}

// Current page indicator
<nav>
  <a href="/" aria-current="page">Home</a>
  <a href="/about">About</a>
</nav>
```

### Descriptive Link Text

```tsx
// ❌ Bad: Non-descriptive
<a href="/projects">Click here</a>

// ✅ Good: Descriptive
<a href="/projects">View all projects</a>

// For icon-only links
<a href="https://github.com/username" aria-label="GitHub profile">
  <GitHubIcon />
</a>
```

## Color Contrast

### Minimum Contrast Ratios

WCAG 2.1 Level AA requirements:
- Normal text (< 18pt): **4.5:1**
- Large text (≥ 18pt or 14pt bold): **3:1**
- UI components and graphics: **3:1**

```css
/* ✅ Good: Sufficient contrast */
.text-primary {
  color: #1a1a1a; /* Black on white: 15.6:1 */
}

.text-secondary {
  color: #4a5568; /* Gray on white: 7.5:1 */
}

/* ❌ Bad: Insufficient contrast */
.text-light-gray {
  color: #d1d5db; /* Light gray on white: 1.7:1 */
}
```

### Color Not Sole Indicator

```tsx
// ❌ Bad: Color only
<span style={{ color: 'red' }}>Error</span>

// ✅ Good: Color + icon + text
<span className="text-red-600">
  <AlertCircle className="inline" />
  Error
</span>

// ✅ Good: Multiple indicators for form validation
<input
  className={errors.email ? 'border-red-500' : 'border-gray-300'}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" className="text-red-600">
    <AlertCircle className="inline" aria-hidden="true" />
    {errors.email}
  </p>
)}
```

### Dark Mode Considerations

```css
/* Ensure sufficient contrast in both modes */
:root {
  --text-primary: #1a1a1a;
  --bg-primary: #ffffff;
}

[data-theme="dark"] {
  --text-primary: #f5f5f5;
  --bg-primary: #0f172a;
}

body {
  color: var(--text-primary);
  background-color: var(--bg-primary);
}
```

## Forms & Input

### Form Labels

```tsx
// ✅ Good: Explicit label association
<label htmlFor="email">Email Address</label>
<input id="email" type="email" name="email" required />

// Alternative: Implicit association
<label>
  Email Address
  <input type="email" name="email" required />
</label>

// For complex inputs
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    name="password"
    aria-describedby="password-requirements"
    required
  />
  <p id="password-requirements" className="text-sm text-gray-600">
    Must be at least 8 characters with numbers and symbols
  </p>
</div>
```

### Error Handling

```tsx
function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <button type="submit">Submit</button>

      {/* Form-level error summary */}
      {Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive" className="error-summary">
          <h3>Please correct the following errors:</h3>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
```

### Required Fields

```tsx
// Visual and semantic indication
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
<input
  id="name"
  name="name"
  required
  aria-required="true"
/>

// Alternative with legend
<fieldset>
  <legend>
    Personal Information
    <span className="text-sm text-gray-600">* Required fields</span>
  </legend>
  {/* Form fields */}
</fieldset>
```

## Images & Media

### Alternative Text

```tsx
// Informative images
<Image
  src="/project-screenshot.jpg"
  alt="Dashboard showing analytics graphs and user metrics"
  width={800}
  height={600}
/>

// Decorative images
<Image
  src="/decorative-pattern.svg"
  alt=""
  aria-hidden="true"
  width={100}
  height={100}
/>

// Complex images with long descriptions
<figure>
  <Image
    src="/chart.png"
    alt="Sales growth chart"
    aria-describedby="chart-description"
    width={800}
    height={400}
  />
  <figcaption id="chart-description">
    Line chart showing 150% sales growth from January to December 2026,
    with a peak in November at $2.5M and lowest point in March at $800K.
  </figcaption>
</figure>

// Icons with text
<button>
  <Download aria-hidden="true" />
  <span>Download Resume</span>
</button>

// Icon-only buttons
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>
```

### Video & Audio

```tsx
// Video with captions and transcript
<video controls>
  <source src="/intro.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/intro-captions.vtt"
    srclang="en"
    label="English"
    default
  />
  <p>
    Your browser doesn't support HTML5 video.
    <a href="/intro.mp4">Download the video</a>
  </p>
</video>

// Audio description
<audio controls>
  <source src="/podcast.mp3" type="audio/mpeg" />
  <p>
    Your browser doesn't support HTML5 audio.
    <a href="/podcast.mp3">Download the audio</a>
  </p>
</audio>
```

## Focus Management

### Focus After User Actions

```tsx
function Modal({ isOpen, onClose }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div role="dialog" aria-modal="true">
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
      {/* Modal content */}
    </div>
  );
}
```

### Focus Styles

```css
/* Remove default outline only if providing custom styles */
button:focus {
  outline: none; /* Only if replacing with custom focus indicator */
}

button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.2);
}

/* Ensure focus visible in high contrast mode */
@media (prefers-contrast: high) {
  button:focus-visible {
    outline: 3px solid currentColor;
  }
}
```

## Testing

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Ensure logical tab order
   - Verify focus indicators are visible
   - Test keyboard shortcuts (Enter, Space, Escape, Arrow keys)

2. **Screen Reader Testing**
   - Test with NVDA (Windows) or VoiceOver (Mac)
   - Verify all content is announced
   - Check heading structure
   - Test form labels and error messages

3. **Color Contrast**
   - Use browser DevTools contrast checker
   - Test with color blindness simulators
   - Verify in dark mode

4. **Zoom & Text Resize**
   - Test at 200% zoom level
   - Ensure no horizontal scrolling
   - Verify text remains readable

### Automated Testing

```bash
# Install axe-core for accessibility testing
npm install -D @axe-core/react jest-axe
```

```typescript
// __tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from '@/app/page';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Browser Extensions

- **axe DevTools** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Includes accessibility audit
- **ColorZilla** - Color picker and contrast checker

### Online Tools

- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Color Palette Builder](https://toolness.github.io/accessible-color-matrix/)
- [Color Oracle](https://colororacle.org/) - Color blindness simulator

## Checklist

### Content

- [ ] All images have appropriate alt text
- [ ] Decorative images use empty alt or aria-hidden
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] Color is not the only visual means of conveying information
- [ ] Text can be resized to 200% without loss of content or functionality

### Structure

- [ ] Proper heading hierarchy (h1 → h6)
- [ ] Semantic HTML elements used (header, nav, main, article, aside, footer)
- [ ] Landmark regions properly labeled
- [ ] Skip to main content link provided
- [ ] Page has a unique, descriptive title

### Keyboard

- [ ] All functionality available via keyboard
- [ ] Visible focus indicators on all interactive elements
- [ ] Logical tab order
- [ ] No keyboard traps
- [ ] Modal focus management implemented

### Forms

- [ ] All form inputs have associated labels
- [ ] Required fields are indicated
- [ ] Error messages are clear and associated with inputs
- [ ] Form validation doesn't rely on color alone
- [ ] Help text associated via aria-describedby

### ARIA

- [ ] ARIA roles used appropriately
- [ ] ARIA labels provided for icon-only buttons
- [ ] ARIA states reflect current component state
- [ ] ARIA live regions for dynamic content
- [ ] No ARIA when semantic HTML is sufficient

### Testing

- [ ] Automated testing with axe or similar tool
- [ ] Manual keyboard navigation test
- [ ] Screen reader testing
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Tested at 200% zoom
- [ ] Lighthouse accessibility score 90+

## Resources

### Guidelines & Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Pa11y](https://pa11y.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning Resources
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/)

### Screen Readers
- [NVDA (Windows)](https://www.nvaccess.org/)
- [JAWS (Windows)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Mac/iOS)](https://www.apple.com/accessibility/voiceover/)
- [TalkBack (Android)](https://support.google.com/accessibility/android/answer/6283677)
