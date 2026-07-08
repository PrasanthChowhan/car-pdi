# Pre-Delivery Inspection (PDI) Assistant

An offline-capable, progressive web application designed for new car buyers to perform thorough, structured pre-delivery inspections. Users can check for defects, decipher VINs, log issues with notes/photos, and download a professional PDF report before signing final delivery paperwork.

The application's interface follows a customized **Cursor Design System**—a quietly confident developer-tools style characterized by a warm editorial cream canvas, near-black warm ink typography, and high-contrast brand voltage accents.

---

## 🚀 Key Features

* **Tailored Checklists**: Dynamic checklists that automatically adapt based on vehicle type (**Internal Combustion Engine (ICE)** vs. **Electric Vehicles (EV)**).
* **Deal-Breakers Warning Panel**: Immediate access to crucial dealership warnings, preparation guidelines, and "walk away" criteria to avoid signing for a defective car.
* **Forensic VIN Decoder**: Decodes vehicle attributes directly inside the documentation checklist.
* **Media & Notes Capture**: Attach photos and diagnostic comments to individual checklist items to log visual defects.
* **Offline-First & PWA**: Fully functional offline. Leverages IndexedDB (or localStorage fallback) and service worker caching to run smoothly in remote stockyards with weak signal.
* **PDF Report Generation**: Exports an inspection summary report as a downloadable A4 PDF detailing all checks, issues, and photos.
* **Premium Aesthetics**: Warm-cream canvas (`#f7f7f4`), warm-ink text (`#26251e`), high-visibility **Cursor Orange** (`#f54e00`) accents, and sleek hairline-only borders.

---

## 🛠️ Technology Stack

* **Framework**: [Astro](https://astro.build) (Static entrypoints with React components island architecture)
* **Frontend**: [React 19](https://react.dev) & [TypeScript](https://www.typescriptlang.org)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Offline persistent store)
* **Build Tooling & PWA**: [Vite](https://vitejs.dev) & [Vite PWA Plugin](https://vite-pwa-org.netlify.app)
* **Styling**: Vanilla CSS (CSS variables, fluid typography, magazine layout properties)
* **Linter**: [Oxlint](https://oxc.rs)
* **PDF Export**: [jsPDF](https://github.com/parallax/jsPDF)
* **Icons**: [Lucide React](https://lucide.dev)

---

## 📂 Project Directory Structure

```
├── .agents/               # Agent configuration & planning skills
├── public/                # Static assets (Favicons, custom SVGs)
│   ├── favicon.svg        # App logo favicon matching DESIGN.md colors
│   └── car.svg            # Aligned vehicle emblem
├── src/
│   ├── assets/            # Secondary icons and SVG symbols
│   ├── components/        # React interface components
│   │   ├── common/        # Shared components (Spinners, layouts)
│   │   ├── inspection/    # Checklist rows, photos, & deal-breakers panels
│   │   ├── pages/         # High-level route views (Setup, Inspection, Summary)
│   │   ├── setup/         # Start-fresh forms & vehicle data inputs
│   │   └── summary/       # PDF trigger actions & issue summary layouts
│   ├── lib/               # Checklist datasets, decoders, and PDF generators
│   ├── store/             # Zustand hydration & persistence actions
│   ├── App.tsx            # Navigation route mapping
│   ├── index.css          # Design system CSS tokens & styles
│   └── pages/             # Astro static routes
│       └── [...all].astro # App entry wrapper page
├── astro.config.mjs       # Astro server integrations configuration
├── DESIGN.md              # Branding guidelines, typography, & color tokens
├── package.json           # Scripts & package dependencies
└── tsconfig.json          # TypeScript compilation settings
```

---

## 💻 Development & Build Scripts

Make sure you have [Node.js](https://nodejs.org) installed. Run the following commands in the project root:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
Spins up the local Astro dev environment:
```bash
npm run dev
```

### 3. Build for Production
Compiles the static bundles, generates TS typings, and registers the PWA service worker into the `/dist` output directory:
```bash
npm run build
```

### 4. Preview the Production Build
Locally serve and inspect the `/dist` directory files:
```bash
npm run preview
```

### 5. Code Linting (Oxlint)
Fast static code analysis check:
```bash
npm run lint
```

---

## 🎨 Design System Specifications

The visual interface references [DESIGN.md](file:///E:/00_HeadQuaters/50_Projects/PDI/DESIGN.md). The core design tokens are defined in [index.css](file:///E:/00_HeadQuaters/50_Projects/PDI/src/index.css):

| CSS Custom Property | Color Hex | System Role |
|---|---|---|
| `--color-canvas` | `#f7f7f4` | Page floor background (warm cream) |
| `--color-ink` | `#26251e` | Main display and header ink (near-black) |
| `--color-primary` | `#f54e00` | Accent brand voltage (Cursor Orange) |
| `--color-surface-card` | `#ffffff` | Elevated card floors |
| `--color-hairline` | `#e6e5e0` | Borders and dividers (no drop shadows) |
| `--color-body` | `#5a5852` | Default body copy readability color |
| `--color-semantic-error` | `#cf2d56` | Deal-breaker indicators and failures |
| `--color-semantic-success` | `#1f8a65` | Passed item indicator |
