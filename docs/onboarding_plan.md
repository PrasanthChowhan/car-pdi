# PDI Web App - Onboarding Experience Plan

## 1. Problem Statement: The Current Implementation
The current onboarding relies on an 11-step interactive popover (`TutorialPopover.tsx`) which attempts to act as a forced product tour. While comprehensive, it suffers from several critical flaws:
- **Intrusive and Blocking:** It hijacks the user's workflow, forcing them to interact with simulated inputs (e.g., typing '1224' for a tyre code) before they can actually use the app.
- **Brittle Architecture:** The implementation relies heavily on `setInterval` polling, DOM query selectors, and programmatic event dispatching to synchronize the React state with the popover inputs.
- **Mobile Unfriendly:** A floating popover anchored to specific DOM elements often breaks layout or requires excessive scrolling on mobile devices—the primary platform for this PWA.
- **Cognitive Overload:** Users are bombarded with 11 steps of instructions before they've even started their inspection, leading to immediate fatigue.

## 2. The Vision: Contextual, Progressive Onboarding
The best onboarding experience for a utility PWA is **Progressive Disclosure**. Users should learn by doing, with the app providing subtle hints exactly when they need them, rather than a massive manual up-front.

### Core Principles
1. **Show, Don't Tell:** Use intuitive UI instead of paragraphs of text.
2. **Contextual Hints:** Only explain a feature when the user navigates to it.
3. **Respect the User's Time:** Allow power users to skip hints instantly.
4. **Native React State:** Never poll the DOM; use React state to drive onboarding UI.

## 3. Implementation Plan

### Step 1: Deprecate `TutorialPopover.tsx`
- Completely remove the `TutorialPopover.tsx` file and its references from `App.tsx`.
- Remove the heavy `@oddbird/popover-polyfill` and anchor positioning dependencies, lightening the initial JS bundle.

### Step 2: The "First Launch" Welcome Bottom Sheet
- When `hasSeenTutorial` is false, show a simple, elegant Bottom Sheet (or modal) upon opening the app.
- **Content:** A quick 3-slide visual carousel (using Lucide icons and brief text):
  1. *Setup:* Enter your car details.
  2. *Inspect:* Tap to pass, or flag to capture photos and notes.
  3. *Export:* Generate an offline PDF for the dealership.
- **Action:** A prominent "Let's Go" button that sets `hasSeenTutorial = true` and closes the sheet. No forced interactive typing required.

### Step 3: Contextual Inline "Coach Marks"
Instead of a global popover tour, implement contextual states stored in `useInspectionStore` (e.g., `hasDismissedChecklistHint`, `hasDismissedTyreHint`).

- **Checklist Page:** The first time they open the inspection page, render a soft inline banner above the first category:
  > 💡 *Tip: Tap the green check mark to pass an item, or the red flag to add defect photos/notes.* 
  (Includes an 'X' to dismiss permanently).
- **Tyre Decoder:** When they navigate to the Tyres tab, display a small contextual hint right next to the DOT input:
  > 💡 *Tip: Look for the 4-digit number on the tyre sidewall (e.g. 1224).*

### Step 4: The "Playground" Checklist Item (Optional)
If interactivity is desired, add a "Tutorial" category at the top of the checklist that contains a single item:
- **Item:** "Practice: Try flagging this item to add a note"
- Once the user interacts with it, it gently fades out or displays a success message, teaching the interaction model natively within the standard UI rather than a simulated popover.

### Step 5: Clean Up the Setup Form
- The current `SetupForm.tsx` has a massive accordion of text at the bottom. While valuable, it clutters the primary action.
- **Action:** Move the extensive FAQs and deep reading material to a dedicated `/guide` route or a slide-out drawer, keeping the setup form extremely clean and focused on just Make, Model, and Power Unit Architecture.

## 4. Technical Refactoring Map

1. **State Updates (`useInspectionStore.ts`):**
   - Remove `tutorialStep` logic.
   - Add fine-grained flags: `hasSeenWelcome`, `hasSeenChecklistHint`.
2. **Component Updates:**
   - Create `WelcomeSheet.tsx` for the initial 3-step static introduction.
   - Add inline `HintBanner.tsx` components within `InspectionPage.tsx`.
3. **Cleanup:**
   - Delete `TutorialPopover.tsx`.

By shifting from a forced, polling-based DOM popover to a state-driven progressive disclosure model, the app will feel significantly faster, more reliable on mobile, and vastly more professional—aligning perfectly with the premium Cursor-inspired design language.
