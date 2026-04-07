# ResumeBuilder Client

A clean, responsive resume builder focused on UI quality and smooth editing flow.

## UI-First Highlights

- Clean and responsive layout across desktop and mobile breakpoints
- Component-by-component architecture for maintainable UI development
- Multi-step builder flow with section-based navigation
- Real-time resume preview while editing form data
- Template switching and accent color customization from the editor
- Reusable sections for personal info, summary, and experience forms

## Design Approach

The interface is designed and built **component by component** to keep each part focused and reusable:

- Home/UI sections (`Hero`, `Features`, `Testimonials`, `Footer`)
- Builder controls (`TemplateSelector`, `ColorPicker`, section navigation)
- Form modules (`PersonalinfoForm`, `ProfessionalSummaryForm`, `ExperienceForm`)
- Preview modules (`ResumePreview` with template variants)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Main Screens

- `/` - Landing page with responsive UI sections
- `/login` - Authentication screen UI
- `/app` - App dashboard layout
- `/app/builder/:resumeId` - Guided resume builder UI
- `/view/:resumeId` - Final resume preview page

## Current Data

The builder currently loads demo data from `src/assets/assets.js` (`dummyResumeData`).

## Project Structure

- `src/pages` - Page-level UI and route composition
- `src/Components` - Reusable UI blocks and form components
- `src/Components/templates` - Resume template UIs
- `src/assets` - Static assets and demo content

## Notes

- Frontend-focused implementation in current stage
- Core editing sections are active and connected to live preview
