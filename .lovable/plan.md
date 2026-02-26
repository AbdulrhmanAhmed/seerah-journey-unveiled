

# The Seerah Path — Phase 1 Implementation Plan

## 1. Design System Setup
- Define custom colors in Tailwind config: deep emerald (#064E3B), warm gold (#D4AF37), clean white (#FCFCFC), sand neutral (#F5F5DC)
- Import Google Fonts: **Amiri** (serif for headings) and **Inter** (sans-serif for body)
- Create CSS geometric Islamic patterns for decorative backgrounds/borders
- Update CSS variables for the theme

## 2. Global Navigation Hub
- Sticky navbar with elegant glass-morphism effect
- Logo "The Seerah Path" on the left using Amiri serif font
- Four navigation pillars as premium styled buttons with icons:
  - **The Journey** (Clock icon) → `/journey`
  - **The Character** (Heart icon) → `/character`
  - **The Map** (Compass icon) → `/map`
  - **The Library** (BookOpen icon) → `/library`
- Subtle gold hover effects and underline animations
- Mobile hamburger menu with slide-out drawer

## 3. Hero Landing Page
- Full-viewport hero section with a rich gradient background evoking a desert night sky (deep emerald to dark navy with star-like accents)
- CSS-based geometric Islamic pattern overlay for atmosphere
- Centered elegant greeting text: *"Peace be upon you, traveler. Explore the life of the Final Messenger ﷺ."*
- "Start Your Exploration" CTA button with gold accent styling
- Smooth scroll to the next content section on click
- Fade-in entrance animation on page load

## 4. Content Sections Below Hero
- A brief introductory section about the Seerah Path mission
- A "Four Pillars" overview grid showcasing each navigation area with icons, titles, and short descriptions
- Each pillar card links to its respective route

## 5. Footer
- "Sources & Authenticity" trust section explaining scholarly references
- Site credits and copyright
- Subtle Islamic geometric border pattern at the top of the footer

## 6. Routing & Placeholder Pages
- Set up React Router routes for `/journey`, `/character`, `/map`, `/library`
- Each route gets a minimal placeholder page with the section title, ready for Phase 2 expansion

## 7. Responsive Design
- Mobile-first layout with proper breakpoints
- Collapsible navigation on mobile
- Hero text and CTA scale appropriately across devices

