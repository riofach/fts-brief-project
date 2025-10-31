## Why
The current navigation bar displays text-based branding ("PT Fujiyama Technology Solutions") which takes up valuable space and doesn't feel modern. A logo-based navigation with responsive hamburger menu will improve the visual hierarchy, save space on smaller screens, and provide a more professional, modern appearance consistent with contemporary web design practices.

## What Changes
- Replace text-based company name with a logo (webp format) positioned on the left
- Add theme toggle button on the right side for light/dark mode switching
- Implement responsive hamburger menu for mobile devices
- Maintain all existing navigation functionality (Sign In, Get Started buttons)
- Ensure navigation is sticky/fixed across all pages
- Support both light and dark modes seamlessly

## Impact
- **Affected specs**: 
  - New capability: `site-navigation` (logo-based responsive navigation)
  - May modify: `theme-management` (theme toggle in navbar)
- **Affected components**: 
  - Navbar component (all pages use it)
  - LandingPage, LoginPage, and all authenticated pages
- **Affected systems**: 
  - Navigation layout on all pages
  - Public assets (logo image)
- **Breaking changes**: None (backward compatible)
- **User-facing changes**: Logo replaces text branding; hamburger menu on mobile; cleaner navbar aesthetic
