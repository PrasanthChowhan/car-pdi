# PDI Web App - Site Tutorial Plan

## 1. Problem Statement: The Current Tutorial
The current site tutorial is driven by `TutorialPopover.tsx`, which implements a highly intrusive, 11-step product tour. While it tries to be helpful, it suffers from critical UX and technical flaws:
- **Intrusive and Blocking:** It hijacks the user's screen with a popover, forcing them to interact with simulated inputs (e.g., typing '1224' into a box) before they can use the app.
- **Brittle Architecture:** The tutorial relies on aggressive DOM polling (`setInterval`) and query selectors to anchor itself to elements, which breaks easily on varying screen sizes.
- **Mobile Unfriendly:** Floating popovers anchored to specific elements are notoriously clunky on mobile devices—the primary platform for this offline PWA.

## 2. The Vision: An Interactive, Non-Blocking Tutorial
A great site tutorial should be **optional, contextual, and interactive**. Instead of forcing users through an on-rails popover, we should allow them to learn by doing in a safe environment, or seek help precisely when they need it.

### Core Principles
1. **Show, Don't Tell:** Use visual cues and micro-animations instead of walls of text.
2. **Context-Aware:** Provide help exactly where the user is looking.
3. **Safe to Explore:** Give users a way to practice without fear of messing up real data.
4. **Native React State:** Never poll the DOM; use React state to drive tutorial UI.

## 3. Implementation Plan

### Step 1: Deprecate `TutorialPopover.tsx`
- Completely remove the `TutorialPopover.tsx` file and its references from `App.tsx`.
- This will instantly improve app performance by removing the heavy DOM polling and polyfills (`@oddbird/popover-polyfill`).

### Step 2: Introduce "Demo Mode" (The Interactive Sandbox)
Instead of forcing a tour on real data, offer a **"Try a Demo"** button on the Setup screen.
- **How it works:** When clicked, it bypasses the Setup form and loads the Inspection Page with a "Demo Vehicle" (e.g., *2024 Tesla Model Y (Demo)*).
- **The Playground:** The checklist comes pre-populated with a few items already passed, and one specific "Tutorial Item" pinned to the top:
  > *"Practice: Try tapping the red flag here, then write a quick note!"*
- **The Benefit:** Users can safely practice taking photos, writing notes, and even generating the final PDF without worrying about corrupting an actual car inspection.

### Step 3: On-Demand Tooltips & Micro-Guides
Remove the automatic popovers in favor of subtle, user-initiated help.
- **Inline "?" Icons:** For complex tools like the Tyre DOT Decoder, place a small, subtle `(?)` icon next to the input.
- **Popover on Tap:** When tapped, it reveals a small, native tooltip with a visual diagram (e.g., a tiny SVG illustrating where to find the 4-digit code on a tyre sidewall).

### Step 4: Contextual Empty States
When a user visits a section for the very first time, use the empty space to teach them.
- **Checklist Tab:** "Your checklist is ready. Tap ✅ to pass an item, or 🚩 to report a defect."
- **Summary Tab:** "No defects flagged yet. Flag items during your inspection to see them compile here for your final PDF report."

### Step 5: A Dedicated "How to Use" Knowledge Base
- The current `SetupForm.tsx` has a massive accordion of FAQs at the bottom.
- Move this deep reading material into a dedicated `/tutorial` or `/guide` route (accessible via a "Help & Tutorials" link in the Header).
- **Enhancement:** Inside this dedicated route, include short, looping GIFs/videos showing exact workflows (e.g., "How to capture a photo of a defect", "How to decode your VIN").

## 4. Technical Refactoring Map

1. **State Updates (`useInspectionStore.ts`):**
   - Remove `tutorialStep` logic and DOM synchronization.
   - Add a `isDemoMode` boolean to the store to handle the sandbox logic safely.
2. **Component Updates:**
   - Create a `DemoModeButton.tsx` for the Setup page.
   - Add inline `Tooltip.tsx` components for on-demand help (e.g., next to the Tyre Decoder).
3. **Cleanup:**
   - Delete `TutorialPopover.tsx` entirely.

By shifting from an aggressive, DOM-polling popover to an interactive "Demo Mode" and contextual tooltips, the tutorial becomes a helpful utility rather than an annoying roadblock, perfectly matching the premium, quietly-confident aesthetic of the brand.
