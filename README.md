# Pre-Delivery Inspection (PDI) Assistant

An offline-capable, progressive web application (PWA) designed specifically for new car buyers to perform comprehensive, structured pre-delivery inspections. This tool empowers users to meticulously check for defects, decipher Vehicle Identification Numbers (VINs), log issues with descriptive notes and photos, and generate a professional PDF report—all before signing the final delivery paperwork.

The application interface strictly adheres to a customized **Cursor Design System**—a quietly confident, premium developer-tools style characterized by a warm editorial cream canvas, near-black warm ink typography, and high-contrast brand voltage accents.

---

## 📖 Table of Contents

- [Pre-Delivery Inspection (PDI) Assistant](#pre-delivery-inspection-pdi-assistant)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Key Features](#-key-features)
  - [🎯 How It Works (User Workflow)](#-how-it-works-user-workflow)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [📂 Project Directory Structure](#-project-directory-structure)
  - [💻 Development \& Build Scripts](#-development--build-scripts)
  - [🎨 Design System Specifications](#-design-system-specifications)
  - [🔒 Offline \& Data Privacy](#-offline--data-privacy)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)

---

## 🚀 Key Features

- **Tailored Checklists**: Dynamic checklists that automatically adapt based on vehicle type (**Internal Combustion Engine (ICE)** vs. **Electric Vehicles (EV)**), ensuring relevance for any vehicle delivery.
- **Deal-Breakers Warning Panel**: Immediate access to crucial dealership warnings, preparation guidelines, and non-negotiable "walk away" criteria to protect buyers from signing for a defective car.
- **Forensic VIN Decoder**: Decodes vehicle attributes directly inside the documentation checklist to verify exact make, model, year, and manufacturing details.
- **Rich Media & Notes Capture**: Attach photos and diagnostic comments to individual checklist items to visually document defects in real-time.
- **Offline-First & PWA**: Fully functional offline. Leverages IndexedDB (or localStorage fallback) and service worker caching to run smoothly in remote stockyards or dealership lots with weak or non-existent mobile signals.
- **Professional PDF Report Generation**: Exports an inspection summary report as a downloadable A4 PDF, comprehensively detailing all checks, recorded issues, and attached photos.
- **Premium Aesthetics**: Engineered with a high-end UI featuring a warm-cream canvas (`#f7f7f4`), warm-ink text (`#26251e`), high-visibility **Cursor Orange** (`#f54e00`) accents, and sleek hairline-only borders for maximum clarity and professionalism.

---

## 🎯 How It Works (User Workflow)

1. **Setup & Initialization**: The user selects their vehicle type (ICE or EV) and enters the VIN. The system automatically fetches or decodes relevant vehicle data.
2. **Review Warnings**: Before inspecting, users review critical "Deal-Breakers" to understand exactly what to look for and when to refuse delivery.
3. **Structured Inspection**: Users go through categorized checklist items (Exterior, Interior, Under the Hood, Technology, Test Drive).
4. **Log Issues**: For any failed checks, users can attach specific notes and take photos directly through their device's camera.
5. **Final Review & Export**: Once complete, users review the summary of issues and generate a polished PDF report to present to the dealership or retain for their records.

---

## 🛠️ Technology Stack

Built with a modern, high-performance web development stack prioritizing speed, offline capabilities, and developer experience.

- **Framework**: [Astro](https://astro.build/) (Static entrypoints with React components island architecture)
- **Frontend**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Offline persistent store via `idb-keyval`)
- **Build Tooling & PWA**: [Vite](https://vitejs.dev/) & [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Styling**: Vanilla CSS (CSS variables, fluid typography, magazine layout properties)
- **Code Quality**: [Oxlint](https://oxc.rs/) (Extremely fast static code analysis check)
- **Export Utility**: [jsPDF](https://github.com/parallax/jsPDF) (Client-side PDF generation)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Optimization**: Custom Node.js scripts using `sharp`

---

## 📂 Project Directory Structure

```text
├── .agents/               # Agent configuration & planning skills
├── public/                # Static assets (Favicons, custom SVGs, manifest)
│   ├── favicon.svg        # App logo favicon matching DESIGN.md colors
│   └── car.svg            # Aligned vehicle emblem
├── scripts/               # Custom build and optimization scripts (e.g., optimize-images)
├── src/
│   ├── assets/            # Secondary icons and SVG symbols
│   ├── components/        # React interface components
│   │   ├── common/        # Shared components (Spinners, layouts, buttons)
│   │   ├── inspection/    # Checklist rows, photo capture, & deal-breakers panels
│   │   ├── setup/         # Start-fresh forms & vehicle data inputs
│   │   └── summary/       # PDF trigger actions & issue summary layouts
│   ├── lib/               # Utilities: Checklist datasets, decoders, and PDF generators
│   ├── store/             # Zustand hydration & persistence actions
│   ├── pages/             # Astro static routes
│   │   └── [...all].astro # App entry wrapper page handling React Router
│   ├── App.tsx            # Navigation route mapping (React Router)
│   └── index.css          # Design system CSS tokens & global styles
├── astro.config.mjs       # Astro server integrations & plugin configuration
├── DESIGN.md              # Branding guidelines, typography, & color tokens
├── package.json           # Scripts, dependencies, & project metadata
├── vite.config.ts         # Vite-specific configuration (PWA setup)
└── tsconfig.json          # TypeScript compilation settings
```

---

## 💻 Development & Build Scripts

Make sure you have [Node.js](https://nodejs.org/) installed. Run the following commands in the project root:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
Spins up the local Astro dev environment with Hot Module Replacement (HMR):
```bash
npm run dev
```

### 3. Build for Production
Compiles the static bundles, generates TS typings, and registers the PWA service worker into the `/dist` output directory:
```bash
npm run build
```

### 4. Preview the Production Build
Locally serve and inspect the `/dist` directory files exactly as they would run in production:
```bash
npm run preview
```

### 5. Code Linting (Oxlint)
Fast static code analysis check to enforce quality:
```bash
npm run lint
```

---

## 🎨 Design System Specifications

The visual interface references [DESIGN.md](file:///E:/00_HeadQuaters/50_Projects/PDI/DESIGN.md). The core design tokens are meticulously defined in [index.css](file:///E:/00_HeadQuaters/50_Projects/PDI/src/index.css):

| CSS Custom Property | Color Hex | System Role |
|---|---|---|
| `--color-canvas` | `#f7f7f4` | Page floor background (warm cream) |
| `--color-ink` | `#26251e` | Main display and header ink (near-black) |
| `--color-primary` | `#f54e00` | Accent brand voltage (Cursor Orange) |
| `--color-surface-card` | `#ffffff` | Elevated card floors for content separation |
| `--color-hairline` | `#e6e5e0` | Borders and dividers (clean, no drop shadows) |
| `--color-body` | `#5a5852` | Default body copy readability color |
| `--color-semantic-error` | `#cf2d56` | Deal-breaker indicators and checklist failures |
| `--color-semantic-success` | `#1f8a65` | Passed checklist item indicator |

---

## 🔒 Offline & Data Privacy

- **100% Client-Side**: All data entered, including VINs, notes, and photos, are stored entirely on the user's device. No data is ever transmitted to an external server.
- **Persistent Storage**: Utilizes IndexedDB to safely store high-resolution photos and state so that users do not lose their inspection progress even if the browser closes or the device restarts.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions to improve the checklists, add new vehicle-specific considerations, or enhance the UI/UX:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
