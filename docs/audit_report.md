## System model

- **Architecture**: A client-side only React SPA built with Astro, targeted primarily at mobile users (inspectors on the floor).
- **State Boundaries**: Uses Zustand for reactive UI state, which eagerly writes to IndexedDB (`idb-keyval`) for offline persistence.
- **Data Model Separation**: The app state (JSON) is stored in `pdi-db-v2` / `app-state`, while heavy binary blobs (images) are stored separately in `pdi-blob-db` to prevent JSON serialization bloat.
- **PDF Generation**: Runs entirely on the client thread using `jspdf`, loading blobs from IndexedDB, converting to base64 (now optimized to direct image load via Object URLs), and painting them into the PDF context.
- **Trust Boundaries**: No server trust boundaries. The primary risk vectors are device storage limits, mobile browser memory ceilings (OOM), and local data corruption across version upgrades.

## Critical issues

None found.

## High issues

None. (All previously identified high issues have been resolved).

### [RESOLVED] Client-side OOM (Out of Memory) risk during PDF Generation
- **Severity:** High (Resolved)
- **Evidence:** `src/lib/pdfGenerator.ts` / `generatePDIReport`
- **Resolution:** Eliminated base64 serialization of images during PDF generation. Images are loaded as direct temporary Object URLs (`URL.createObjectURL`), loaded into an `HTMLImageElement` to capture natural dimensions, rendered to the PDF via `doc.addImage`, and immediately revoked (`URL.revokeObjectURL`) with image source cleared (`element.src = ''`) to release memory. This avoids the 33% base64 memory overhead and prevents DOM memory retention.

### [RESOLVED] Unbounded synchronous IDB writes on every state mutation
- **Severity:** High (Resolved)
- **Evidence:** `src/store/useInspectionStore.ts` / `updateItemStatus`, `updateItemNote`
- **Resolution:** Implemented a debounced save wrapper (`debouncedSaveAppState`) in the Zustand store. Rapid keystrokes (e.g. typing notes) are debounced by 1s, preventing UI stuttering and IndexedDB transaction congestion. Critical mutations (such as resets) cancel pending debounces and write immediately to prevent race conditions.

## Medium issues

None. (All previously identified medium issues have been resolved).

### [RESOLVED] Silent failure on invalid hydration state (Version drift)
- **Severity:** Medium (Resolved)
- **Evidence:** `src/store/useInspectionStore.ts` / `hydrateStore`
- **Resolution:** Introduced a `version: 1` key to `AppState`. During store hydration on application boot, the cache version is checked. If it is stale or missing, the cache state is dropped and reset safely instead of spreading invalid structures and causing React render crashes.

### [RESOLVED] JSON Export silently drops photographic evidence
- **Severity:** Medium (Resolved)
- **Evidence:** `src/components/pages/SummaryPage.tsx` / `handleExportJSON`
- **Resolution:** Added a user-facing blocking confirmation modal before exporting raw JSON. The prompt warns the user that photos are omitted from this backup format, advising them of the scope boundary.

## Architecture risks

- **State / Persistence coupling**: The Zustand store is directly calling `saveAppState` on every action. This tightly couples the business logic to the persistence layer. A subscriber pattern (e.g., `store.subscribe`) would cleanly decouple the IDB writes from the state mutations.
- **No data migration strategy**: There is no versioning in IndexedDB keys (`STATE_KEY = 'pdi_app_state'`). Future breaking changes to the checklist model will crash existing users.
- **Large PDF Payload / Main Thread Blocking**: Generating large binary files synchronously on the UI thread blocks the event loop. Moving PDF generation to a Web Worker would dramatically improve perceived performance and prevent the browser from prompting "This page is unresponsive".

## Production readiness gaps

- **Missing Telemetry/Observability**: If PDF generation fails or quota is exceeded, it only logs to `console.error`. The developer will never know users are failing to generate reports in production.
- **No Error Boundary**: [RESOLVED] Added a React Error Boundary (`src/components/common/ErrorBoundary.tsx`) wrapping the entire App. It renders a modern, user-friendly fallback page with options to clear local IndexedDB state/blobs and restart the application if any rendering or hydration crash occurs.
- **Unsafe Error Bubbling**: `saveImageBlob` throws after alerting, which is caught in `ChecklistItemRow.tsx`, but the user sees two successive alerts, creating a confusing UX.

## Priority fix plan (Completed)

1. **[DONE]** Implement debouncing on `saveAppState` in the Zustand store to prevent I/O blocking and IDB race conditions during typing/clicking.
2. **[DONE]** Add a React Error Boundary around the `App` that provides a "Clear Local Data & Restart" button in case of hydration crashes.
3. **[DONE]** Add memory-safety to the PDF Generator (ensure data URLs are cleared/avoided using Object URLs).
4. **[DONE]** Decouple the state structure version by adding a `version: 1` key to `AppState` and dropping old state if versions mismatch to prevent rendering crashes.
5. **[DONE]** Update `handleExportJSON` to warn users that photos are omitted, or disable the feature until `.zip` export is built.

## Verdict

`Ship`

The application logic has been successfully hardened. The priority fixes have addressed the critical client-side OOM risks during PDF rendering, resolved IndexedDB write-congestion issues, prevented hydration version-drifts, and provided a safe Recovery/Error Boundary page. The app is now robust enough for production field use.
