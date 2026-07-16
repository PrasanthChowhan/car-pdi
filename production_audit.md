# Production Code Audit Report

## System model
- Client-side only React application built with Astro and Vite.
- Primary domain logic revolves around a vehicle Pre-Delivery Inspection (PDI) checklist.
- State is managed via `zustand` and persisted locally in the browser using `idb-keyval` (IndexedDB).
- Features decoupled storage: lightweight application state goes to a state store, while heavy image blobs go to a separate blob store referenced by UUIDs.
- Includes a client-side PDF generation module (`pdfGenerator.ts`) using `jspdf` to export the inspection report.
- Trust boundaries are purely client-side; all inputs (vehicle metadata, inspection notes, photos) are assumed to come from the device user with no external API synchronization.

## Critical issues

**Title:** Massive Storage Leak via Orphaned Image Blobs
- **Severity:** Resolved (was Critical)
- **Evidence:** `src/store/useInspectionStore.ts` (`updateItemPhoto`, `updateOverviewPhoto`, `updateItemStatus`, `passAllCategoryItems`, `hydrateStore`)
- **Impact:** None (previously rapid quota exhaustion).
- **Why this fails in production:** Previously, when a user replaced a photo, overwrote an overview photo, or reset an item to pending, the old photo reference was dropped in state, but the actual image blob was left in IndexedDB `blobStore` indefinitely.
- **Resolution:** Added background cleanup calls to `deleteImageBlob(oldPhotoId)` whenever a photo is replaced or removed from the store state. In addition, implemented a robust asynchronous startup garbage collection routine in `hydrateStore` that retrieves all keys from the `blobStore` and compares them against referenced photo IDs in state, automatically pruning any orphaned blobs on app launch.
- **Confidence:** High

**Title:** UI Thread Block via Synchronous Alert in Debounced Background Task
- **Severity:** Resolved (was Critical)
- **Evidence:** `src/lib/storage.ts` (`saveAppState`, `saveImageBlob`), `src/App.tsx`
- **Impact:** None (previously blocked browser main thread).
- **Why this fails in production:** Previously, when auto-saving state or saving photos triggered a `QuotaExceededError`, a synchronous browser `alert()` was called. Since saving happens in the background/debounced thread, these alerts blocked user typing and actions.
- **Resolution:** Removed synchronous `alert()` calls from the low-level storage utility layer. Instead, error boundary and store state catch the exception and update a newly added `storageError` state. The main `App.tsx` layout listens to this state and renders a non-blocking, modern warning banner at the top of the interface that can be closed manually.
- **Confidence:** High

## High issues

**Title:** Silent Failures on Data Deletion Corrupts User Confidence
- **Severity:** Resolved (was High)
- **Evidence:** `src/lib/storage.ts` (`clearAppState`, `deleteImageBlob`, `clearAllBlobs`), `src/components/pages/SetupPage.tsx`, `src/components/pages/SummaryPage.tsx`
- **Impact:** None (previously failed silently and resurrected deleted state).
- **Why this fails in production:** Deletion wrappers previously caught errors, printed to `console.error`, and resolved normally. Calling functions assumed success and cleared the UI, but database state remained.
- **Resolution:** Modified low-level deletion utility methods to re-throw IndexedDB operational errors. Wrapped the UI `resetInspection` calls in try/catch blocks within both the setup and summary pages to capture failed deletions and notify the user to reload the page or check permissions, preventing data resurrection.
- **Confidence:** High

**Title:** PDF Generation Corrupts on Unbounded Input Overflows
- **Severity:** Resolved (was High)
- **Evidence:** `src/lib/pdfGenerator.ts` (`generatePDIReport`), `src/components/inspection/ChecklistItemRow.tsx`, `src/components/pages/SummaryPage.tsx`, `src/components/setup/SetupForm.tsx`
- **Impact:** None (previously generated corrupted or overlapping PDF layouts).
- **Why this fails in production:** PDF row height calculations could exceed the total height of an A4 page if a user typed a massive text block (e.g. notes or remediation commitments), causing text to bleed off the bottom page edge and overwrite footers.
- **Resolution:** Added hard input validation constraints (`maxLength`) in the UI form elements (50 chars for make/model, 500 chars for checklist item notes, 10 chars for odometer, and 1000 chars for dealer remediation commitments). Additionally, implemented safety truncation logic in the PDF generator (`pdfGenerator.ts`) to truncate item notes (to 500 chars) and remediation commitments (to 1000 chars) before calculating row heights and generating layout lines, guaranteeing vertical layout safety.
- **Confidence:** High

## Medium issues

**Title:** Split-Brain State Synchronization Risk
- **Severity:** Resolved (was Medium)
- **Evidence:** `src/store/useInspectionStore.ts` (`triggerSaveWithStatus`, `saveAppStateWithStatus`), `src/components/common/Header.tsx`
- **Impact:** None (previously caused silent saving failures with no user feedback).
- **Why this fails in production:** Zustand state mutated synchronously while background IndexedDB saves happened asynchronously. If a write failed, the user remained unaware, closed the tab, and lost progress.
- **Resolution:** Added a volatile `syncStatus` state (`'saved' | 'saving' | 'error'`) to the Zustand store. The status immediately shifts to `'saving'` on user action and updates to `'saved'` or `'error'` when the storage promise completes. Added a premium sync indicator badge in the header layout, featuring a green dot for successful saves, a orange dot with a breathing pulse animation for active saving, and a red dot for errors.
- **Confidence:** High

## Architecture risks
- **Decoupled IDB stores now GC-protected:** Separating JSON state and binary blobs previously risked database bloat from orphaned blobs. The new startup garbage collection routine successfully aligns state reference constraints with binary persistence.
- **Client-only volatility:** Browser-based storage remains the primary database for these logs. While offline capabilities are robust, clear warnings about incognito limitations and prominent actions to export ZIP/PDF data have been maintained to protect against cache clearings.
- **Image memory pressure:** Image compression utilizes Canvas scaling, which handles scaling in memory. While memory is released rapidly, users with low-RAM mobile devices should avoid capturing photos too quickly in rapid succession.

## Production readiness gaps
- **Observability:** Client-side telemetry (e.g. Sentry) is still missing. While UI banners display storage/database errors to the user, developer visibility remains restricted to browser consoles.
- **Form Limits:** Successfully addressed by enforcing maximum input lengths across all user entry forms.
- **React Error Boundaries:** Verified that the application is fully wrapped by a functional React Error Boundary in `App.tsx` that catches rendering crashes and offers a clean cache clearing restart mechanism.

## Priority fix plan
1. *Completed:* Implemented background image blob deletion and startup garbage collection in `useInspectionStore.ts` to prevent the storage leak.
2. *Completed:* Removed synchronous `alert()` blockages from the storage module, routing errors to state-driven top banners in `App.tsx`.
3. *Completed:* Enabled error propagation on data deletion wrappers and updated page handlers to show clear error messages if resets fail.
4. *Completed:* Implemented string length truncation in `pdfGenerator.ts` and added UI `maxLength` limits to inputs to ensure visual layout safety.
5. *Completed:* Added a real-time `syncStatus` state and integrated a premium animated sync indicator badge in the header navigation.

## Verdict
`Reasonably safe to ship`

The application has been audited and fully upgraded to resolve the data lifecycle leaks and thread-blocking alert failures that previously made it unstable. All critical storage leakages, synchronous main-thread blockages, silent deletion failures, and PDF layout overflow vulnerabilities have been successfully resolved with defensive programming. Furthermore, introducing the sync status header badge provides the user with real-time feedback regarding data persistence, making it fit for release.
