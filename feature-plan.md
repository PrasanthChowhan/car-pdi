***
title: "feat: Visual Redesign (Premium Aesthetic Inspired)"
status: active
created: 2026-07-29
updated: 2026-07-29
type: feat
depth: deep
owner: Agent
labels: [frontend, web, priority-high, design, pdi]
***

# Visual Redesign (Premium Aesthetic Inspired)

## Summary

This feature revamps the visual design of the Car PDI (Pre-Delivery Inspection) app by drawing inspiration from the vibrant, modern aesthetics of the provided `reference.jpg`. While maintaining our core PDI functionality (VIN decoding, defect logging, offline PDF generation), we will pivot from the current flat/hairline "Cursor Design System" to a more dynamic, consumer-friendly look featuring soft shadows, rich orange/blue gradients, overlapping layout elements, and high-quality vehicle imagery.

***

## Problem Frame

### Current state
- The app uses a minimalist, developer-tool-like aesthetic (cream background, hairline borders, flat design).
- While functional, it may feel dry or overly technical for everyday car buyers using the tool at a dealership.

### User pain
- Users performing a high-stakes, stressful task (inspecting a new car purchase) might benefit from a more delightful, premium, and reassuring interface that feels like a top-tier consumer app rather than a utility form.

### Why now
- Elevating the visual quality will increase user trust in the tool's authority and make the inspection process feel like a premium experience.

***

## Goals

- Adopt the vibrant color palette from the reference: Vibrant Orange (e.g., `#FF6B35`), Deep Blue (e.g., `#4A55A2`), and clean white/light gray backgrounds for contrast.
- Introduce soft, modern drop shadows, rounded corners (large border-radiuses), and gradient accents.
- Restyle the core PDI components (VIN input, Deal-Breakers, Checklist items) to map to the layout patterns seen in the reference image.
- Source or generate premium 3D/photorealistic car assets to serve as visual anchors for the app.

## Non-goals

- Changing the core business logic (offline storage, jsPDF generation, React Router logic).
- Creating a car rental app. The domain remains strictly Pre-Delivery Inspection.

***

## Requirements

- **R1.** **Hero Section**: Create a split hero banner featuring a high-quality overlapping car image on a gradient blob, with a prominent call-to-action to "Start New Inspection".
- **R2.** **Floating Input**: Adapt the floating search bar concept from the reference into the VIN Decoder / Vehicle Setup form, overlapping the hero section.
- **R3.** **How it Works**: Style the "How to Inspect" workflow (Setup -> Check -> Report) using the dotted-line timeline component style.
- **R4.** **Checklist UI**: Redesign the checklist items and Deal-Breakers to resemble the "Best Services" feature lists (clean cards, prominent colorful icons, soft shadows).
- **R5.** **Summary/Issues UI**: Style the logged issues and attached photos similarly to the "Top Deals" cards, making them look structured and premium.
- **R6.** Ensure all new styles remain fully responsive and maintain readability for outdoor use (dealership lots).

***

## Success Criteria

- The app feels significantly more modern and consumer-facing, strongly resembling the premium aesthetic of `reference.jpg`.
- Core PDI functionality (adding notes, photos, exporting PDF) remains 100% intact and intuitive.
- The new CSS does not break the Vite PWA offline capabilities.

***

## Key Technical Decisions

- **CSS Updates** — We will rewrite the variables in `index.css` (removing `--color-canvas` and `--color-hairline` patterns in favor of new shadow and gradient utilities). We will continue using Vanilla CSS as defined in the stack.
- **Typography** — Upgrade the font family (e.g., Poppins or Inter) to match the bold, clean geometric look of the reference.
- **Asset Integration** — New images will be optimized using the existing `sharp` scripts and placed in `public/` or `src/assets/`.

***

## High-Level Design

### Layout Mapping (Inspiration -> PDI App)

```text
Reference Concept        -> Car PDI Equivalent
---------------------------------------------------------
Hero (Rental Deals)      -> Hero (Start PDI, App Value Prop)
Floating Search Bar      -> Floating VIN Entry & Vehicle Select
How it Works (3 steps)   -> PDI Process (Initialize, Inspect, Export)
Best Services            -> Deal-Breakers & Warning Panel
Top Deals Grid           -> Inspection Categories / Issues Logged
```

***

## Scope Boundaries

### In scope
- Rewriting `index.css` and updating React components in `src/components/*` to apply the new classes and layout structures.
- Adding new SVG icons and generating high-quality car images.
- Updating `App.tsx` and layout wrappers for the new hero/floating designs.

### Deferred
- Major changes to the PDF report output format (we will focus on the web UI first).

***

## Implementation Units

### U1. Design System & Assets
**Goal:** Define new CSS variables, fonts, and generate imagery.
**Approach:** 
1. Update `src/index.css` with new color tokens, shadow utilities, and typography.
2. Generate the premium car imagery (e.g., Hero SUV, top-down car) and place in `public/`.

### U2. Hero & VIN Setup Component
**Goal:** Build the immersive landing view.
**Approach:** 
1. Create a `HeroBanner` component with the split layout and gradient background.
2. Redesign the `Setup` form (VIN input) as a floating card overlapping the hero.

### U3. Inspection Workflow UI
**Goal:** Redesign the Deal-breakers and Checklist UI.
**Approach:** 
1. Update `inspection/` components to use white cards, soft shadows, and vibrant icons.
2. Ensure the "Capture Photo" and "Add Note" buttons match the new pill-shaped, vibrant button styles.

### U4. Summary & Navigation
**Goal:** Finalize the layout and export view.
**Approach:** 
1. Restyle the layout headers and navigation tabs.
2. Style the summary view to display logged defects in premium cards (like the "Top Deals" grid).

***

## Wireframe & Image Asset Descriptions

### PDI App Wireframe (Top to Bottom)

1. **Navbar:** 
   - Clean white background. Brand Logo (PDI Assistant). "Resume Inspection" button (Blue/Orange).
2. **Hero Section:**
   - Left side: Bold headline "Inspect Before You Accept", subtitle emphasizing the importance of PDI.
   - Right side: Orange/Red gradient background blob. A high-quality, glossy car image overlaps the background.
3. **Floating VIN Entry (Replaces Search Bar):** 
   - Overlaps the bottom of the hero section.
   - Fields: Vehicle Type (Dropdown), VIN Input (Text), and a large Blue "Start Inspection" button.
4. **How PDI Works (Timeline):** 
   - Three columns with circular icons: 1. Setup Vehicle, 2. Inspect & Document, 3. Generate Report. Connected by dotted lines.
5. **Deal-Breakers (Replaces Best Services):** 
   - Left side: Large image of a car (perhaps highlighting a specific part).
   - Right side: Vertical list of critical warnings (Check Paint, Verify Panel Gaps, Inspect Tires) with red alert icons.
6. **Checklist Categories (Replaces Top Deals):**
   - Filter pills (Exterior, Interior, Under Hood, Tech, Test Drive).
   - Grid of category cards or active checklist items. Cards have soft shadows, clear typography, and a status indicator (Pass/Fail).
7. **Export Report Promo (Replaces App Promo):** 
   - Full-width gradient banner.
   - Left side: "Generate your professional PDF report to show the dealer."
   - Right side: A mockup showing a beautiful PDF report or the summary screen on a mobile device.

### Required Image Assets for Generation

To achieve this look for the PDI app, we need:

1. **Hero Vehicle (`hero-inspection-car.png`)**: 
   - *Description*: A high-resolution, photorealistic image of a sleek, modern SUV or Sedan (e.g., Porsche Macan or Tesla Model 3) in a bright color (like Orange or Pearl White). 
   - *Style*: Studio lighting, 3/4 front angle, isolated on a transparent background with a soft bottom shadow, conveying pristine condition.
2. **Deal-Breaker Vehicle (`inspection-detail-car.png`)**:
   - *Description*: A sleek car shown from a slightly different angle, perhaps with a subtle graphic overlay pointing to common inspection areas (wheels, hood).
   - *Style*: 3/4 front or side angle, transparent background, premium feel.
3. **Mobile/Tablet Mockup (`report-mockup.png`)**:
   - *Description*: A modern tablet or smartphone displaying the PDI app's summary screen or a stylized PDF report. 
   - *Style*: 3D render, slightly angled, isolated on a transparent background to float over a gradient banner.
