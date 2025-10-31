# Landing Page Image Guide

This guide explains where to place images for the redesigned landing page.

## Required Images

### 1. Hero Section Image
**Location:** `/public/images/hero-image.png`  
**Recommended Size:** 1200x1200px or 1000x800px  
**Format:** PNG, JPG, or WebP  
**Description:** Main hero image showing professional team members or dashboard mockup

**Suggested Content:**
- Professional team members in business attire
- Dashboard interface mockup showcasing the brief management system
- Abstract modern design with tech/project management theme

**How to Use:**
Once you place your image in `/public/images/hero-image.png`, update the LandingPage.tsx file:

```tsx
{/* Replace the placeholder div with: */}
<div className="relative lg:h-[600px] h-[400px]">
  <img 
    src="/images/hero-image.png" 
    alt="Project Brief Management Platform"
    className="w-full h-full object-cover rounded-3xl shadow-2xl"
  />
</div>
```

### 2. Optional: Additional Images (Future Enhancement)

#### Dashboard Preview
**Location:** `/public/images/dashboard-preview.png`  
**Description:** Screenshot or mockup of the dashboard interface

#### Team Photo
**Location:** `/public/images/team.jpg`  
**Description:** Photo of the development team

#### Client Logos (Partner Section)
**Location:** `/public/images/clients/`  
**Files:** `client-1.png`, `client-2.png`, etc.

## Image Creation Tips

### Hero Image Recommendations:
1. **Professional Photography:**
   - High-resolution images of team members
   - Clean, modern background
   - Good lighting

2. **Dashboard Mockups:**
   - Use Figma, Sketch, or Adobe XD
   - Show key features: brief list, status indicators, charts
   - Match the project's color scheme (blue primary)

3. **Stock Photos:**
   - Unsplash: https://unsplash.com/ (free, high-quality)
   - Pexels: https://pexels.com/ (free)
   - Search terms: "business team", "web development", "project management"

4. **AI-Generated:**
   - Midjourney, DALL-E, or Stable Diffusion
   - Prompt: "professional web development team, modern office, tech company, corporate photography"

## Image Optimization

Before adding images, optimize them:

1. **Compress Images:**
   - Use https://tinypng.com/ or https://squoosh.app/
   - Target: < 500KB for hero images

2. **WebP Format:**
   - Modern format with better compression
   - Use online converters or tools like `sharp` npm package

3. **Responsive Images:**
   - Provide multiple sizes: 480w, 768w, 1024w, 1200w
   - Use `<picture>` element with srcset

## Directory Structure

```
public/
  └── images/
      ├── hero-image.png          # Main hero image
      ├── dashboard-preview.png   # Optional: dashboard mockup
      ├── team.jpg                # Optional: team photo
      └── clients/                # Optional: client logos
          ├── client-1.png
          ├── client-2.png
          └── ...
```

## Dark Mode Considerations

Ensure images work well in both light and dark modes:
- Use images with neutral backgrounds
- Add subtle borders or shadows for contrast
- Consider providing separate images for light/dark modes if needed

## Need Help?

If you need custom images created or have questions:
1. Hire a designer on Fiverr or Upwork
2. Use Canva templates for quick mockups
3. Request AI-generated images with specific prompts
