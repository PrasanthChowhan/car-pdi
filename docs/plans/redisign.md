***
title: "feat: Homepage Narrative Redesign"
status: implemented
created: 2026-07-29
updated: 2026-07-29
type: feat
depth: medium
owner: PDI Assistant
labels: [marketing, web, high-priority]
***

# Homepage Narrative Redesign

## Summary

Redesign the landing page from a traditional SaaS homepage into a story-driven experience focused on the emotional moment before accepting delivery of a new vehicle. The homepage should convince buyers that inspecting their vehicle before signing is essential, then naturally introduce PDI Assistant as the solution. The desired outcome is higher trust, stronger emotional engagement, and improved inspection starts.

***

## Problem Frame

### Current state

- Homepage introduces the product before establishing why visitors need it.
- Founder story and product messaging compete for attention.
- Hero imagery does not consistently reinforce the core problem.
- Product screenshots and inspection workflow are buried further down the page.

### User pain

- Buyers don't immediately understand why they should inspect a new vehicle.
- Visitors fail to connect emotionally with the risk of accepting a damaged or demo vehicle.
- The homepage feels like software marketing instead of preparation for delivery day.

### Why now

- The product has matured beyond needing feature-first marketing.
- Founder story is a unique differentiator that competitors cannot copy.
- Positioning around buyer protection creates a stronger emotional hook than generic inspection software.

***

## Goals

- Create emotional urgency before introducing the product.
- Position PDI Assistant as protection against dealership mistakes and hidden defects.
- Increase inspection starts by making visitors feel they need the tool before delivery day.

## Non-goals

- Redesign the inspection workflow.
- Change application functionality.
- Modify pricing or account flows.

***

## Requirements

- **R1.** Hero headline must communicate buyer protection rather than software capabilities.
- **R2.** Hero imagery must depict a modern dealership or new vehicle delivery—not abandoned or classic vehicles.
- **R3.** Founder story should appear after the hero as supporting credibility, not as the primary message.
- **R4.** Introduce a clear "Start Inspection" CTA above the fold.
- **R5.** Display the product workflow immediately after the emotional problem statement.
- **R6.** Maintain excellent readability across desktop and mobile.
- **R7.** Homepage should feel premium and calm rather than sensational.
- **R8.** Show real inspection screenshots instead of relying primarily on descriptive text.
- **R9.** Measure CTA clicks and inspection starts.
- **R10.** Preserve existing inspection functionality without breaking current routes.

***

## Success Criteria

- Users understand the purpose of PDI Assistant within five seconds.
- Visitors identify the product as protection before vehicle delivery.
- Hero CTA click-through rate increases.
- No regression to inspection flow or application performance.

***

## Key Technical Decisions

- **Narrative-first layout** — Build the homepage around a story instead of a feature list.
- **Founder credibility below hero** — Separate the founder's experience from the primary value proposition.
- **Visual proof over paragraphs** — Use screenshots, inspection previews, and reports instead of long explanations.

***

## Alternatives Considered

### Option A — Traditional SaaS Landing Page

- Pros: Familiar structure.
- Cons: Weak emotional differentiation.
- Rejected because: Competes directly with every other inspection tool.

### Option B — Founder Story First

- Pros: Authentic.
- Cons: Delays explaining the product.
- Rejected because: Visitors need to understand the problem before caring about the founder.

***

## High-Level Design

### Data flow

```mermaid
flowchart LR
    A[Visitor lands] --> B[Problem awareness]
    B --> C[Founder credibility]
    C --> D[Product solution]
    D --> E[Inspection workflow]
    E --> F[Start Inspection]
```

### Core model

```ts
type HomepageSection = {
  id: string;
  title: string;
  description: string;
};

type CTA = {
  label: string;
  href: string;
};
```

### Component / module architecture

```text
Homepage
├── Hero
├── Risk Section
├── Founder Story
├── Product Preview
├── How It Works
├── Sample Report
├── Trust Section
├── FAQ
└── Final CTA
```

### State ownership

- Static marketing content.
- CTA analytics.
- No additional application state.

***

## UX Behavior

### Default

Users immediately see the risk of accepting a vehicle without inspection.

### Active interaction

Primary CTA remains visible.
Product screenshots demonstrate inspection flow.

### Temporary overrides

None.

### Empty / edge states

- Mobile layouts remain vertically optimized.
- CTA always accessible.
- Images gracefully degrade if unavailable.

***

## Scope Boundaries

### In scope

- Homepage redesign.
- Narrative restructuring.
- Updated hero imagery.
- New marketing sections.

### Deferred

- Interactive inspection demo.
- Personalized landing pages.
- Localization.

### Out of scope

- Inspection application.
- Backend APIs.
- User accounts.

***

## Implementation Units

### U1. Hero Redesign

**Goal:** Establish urgency immediately.  
**Requirements:** R1, R2, R4

**Approach:**

1. Replace current hero with modern dealership imagery.
2. Introduce protection-focused headline.
3. Add primary CTA.

**Tests:**

- Hero responsive.
- CTA visible.
- Readability verified.

***

### U2. Narrative Section

**Goal:** Build trust through founder story.

**Requirements:** R3

**Approach:**

1. Explain founder experience.
2. Connect experience to product creation.
3. Link to full story.

**Tests:**

- Story placement.
- Mobile readability.

***

### U3. Product Proof

**Goal:** Demonstrate how PDI Assistant solves the problem.

**Requirements:** R5, R8

**Approach:**

1. Display inspection screenshots.
2. Show sample report.
3. Explain workflow.

**Tests:**

- Screenshot quality.
- CTA placement.
- Navigation flow.

***

## Testing Strategy

### Unit

- Component rendering.
- CTA behavior.
- Responsive layouts.

### Integration

- Homepage to inspection flow.
- Story links.
- Navigation.

### Manual QA

- Desktop.
- Tablet.
- Mobile.
- Dark/light backgrounds.

### Regression

- Existing inspection flow remains unchanged.
- Performance unchanged.

***

## Performance Considerations

- Optimize hero imagery.
- Lazy-load screenshots below the fold.
- Maintain Lighthouse performance.

***

## Accessibility

- Semantic headings.
- Keyboard-accessible navigation.
- Proper image alt text.
- Reduced-motion support.
- WCAG-compliant color contrast.

***

## Persistence & Configuration

No persistent homepage preferences.

```ts
type HomepagePreferences = {};
```

***

## Telemetry / Debugging

- Hero CTA clicks.
- Inspection starts.
- Scroll depth.
- Sample report views.

***

## Rollout Plan

### Phase 1

Implement redesigned homepage behind a feature flag.

### Phase 2

Internal QA and copy refinement.

### Phase 3

Deploy as the default homepage.

### Rollback

Restore previous homepage layout.

***

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Story feels too sensational | Balance emotion with factual language |
| Hero image distracts from CTA | Prioritize contrast and spacing |
| Reduced feature visibility | Introduce product immediately after problem framing |

***

## Open Questions

- Should the founder story include real photos?
- Should the hero use dealership imagery or inspection imagery?
- Should a sample inspection report appear above the fold?

***

## Sources / References

- Existing PDI Assistant homepage
- Founder experience (167 km demo vehicle)
- Apple marketing principles
- Stripe landing page hierarchy
- Linear product storytelling