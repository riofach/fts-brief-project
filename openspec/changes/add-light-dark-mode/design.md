## Context
The Brief Management System uses Tailwind CSS with shadcn/ui components. Tailwind natively supports dark mode through the `dark:` variant system. The application needs a way to:
1. Allow users to choose their preferred theme
2. Persist the theme preference across sessions
3. Apply the theme consistently across all pages
4. Integrate with the existing Context API state management pattern

## Goals / Non-Goals

### Goals
- Enable users to switch between light and dark modes seamlessly
- Persist user theme preference using localStorage
- Ensure all existing components and pages work in both themes without breaking changes
- Provide a simple, reusable way for future components to support dark mode

### Non-Goals
- Implement automatic theme detection based on system preferences (can be added later)
- Create new custom color schemes beyond light/dark
- Modify existing Tailwind configuration

## Decisions

### Decision 1: Theme Context Provider
**What**: Create a ThemeContext similar to existing AuthContext and AppContext
**Why**: Maintains consistency with the project's state management pattern using React Context API
**Alternatives considered**:
- Zustand or Redux: Adds complexity beyond current stack
- Global variable: Not reactive and harder to test

### Decision 2: localStorage for Persistence
**What**: Store theme preference in `localStorage.setItem('theme', 'light' | 'dark')`
**Why**: Simple, no backend required (aligns with prototype phase), works across page reloads
**Alternatives considered**:
- Backend API: Requires backend implementation not available in prototype
- SessionStorage: Doesn't persist across sessions

### Decision 3: Tailwind dark: Variants
**What**: Use Tailwind's built-in `dark:` utility classes and class-based dark mode
**Why**: Already configured in the project, no CSS changes needed, works with shadcn/ui
**Alternatives considered**:
- CSS variables: Requires CSS modifications and more complex theming logic
- Custom CSS framework: Adds unnecessary complexity

### Decision 4: DOM Class Application
**What**: Add `dark` class to document root (`<html>`) element when dark mode is active
**Why**: Tailwind's class-based dark mode strategy automatically applies `dark:` variants when this class is present
**Alternatives considered**:
- Media query: Doesn't allow user override
- Custom class strategy: More complex without added benefit

### Decision 5: Theme Switcher Placement
**What**: Place theme toggle button in the layout header/navigation
**Why**: Accessible in all pages, consistent location, follows common UI patterns
**Alternatives considered**:
- Settings page: Hides feature from quick access
- Footer: Less discoverable

## Risks / Trade-offs

### Risk 1: Performance
**Impact**: Low - minimal overhead (single class toggle + localStorage)
**Mitigation**: Theme switching is instant; no re-renders of entire page tree needed

### Risk 2: Component Compatibility
**Impact**: Medium - some custom components may not have dark mode variants
**Mitigation**: Start with shadcn/ui components (already dark-mode ready); audit custom components during implementation

### Risk 3: Color Contrast
**Impact**: Medium - must ensure WCAG AA accessibility in both modes
**Mitigation**: Validate color contrasts; shadcn/ui provides accessible dark mode defaults

## Migration Plan
1. Create ThemeContext and provider component
2. Wrap App with theme provider in main.tsx or App.tsx
3. Update layout header with theme toggle button
4. Add `dark:` variants to custom components as needed
5. Test theme switching on all pages
6. Update Tailwind configuration if needed (verify dark mode is enabled)

## Open Questions
- Should we auto-detect system theme preference on first visit? (Can be added in follow-up proposal)
- Do we need additional themes beyond light/dark? (Not in this proposal; can be extended later)

