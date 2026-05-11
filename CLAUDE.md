# TripShare Frontend — Claude Code Instructions

## Stack
React 19 · Vite · TailwindCSS 4 · React Router 7 · Zustand · React Hook Form · Zod · Leaflet · Radix UI · class-variance-authority

## Commands
- `npm run dev` — Vite dev server
- `npm test` — Vitest + Testing Library
- `npm run build` — tsc + vite build
- `npm run test:coverage` — coverage report

## Architecture
- `src/pages/` — Route-level page components
- `src/components/` — Reusable UI components
- `src/store/` — Zustand global state slices
- `src/hooks/` — Custom React hooks
- `src/api/` — Typed API client functions
- `src/schemas/` — Zod validation schemas (shared with forms)
- `src/types/` — TypeScript interfaces

## Conventions
- Zustand for global state; React Hook Form for forms — never mix them for the same field
- `class-variance-authority` for component variants with TailwindCSS
- No direct DOM manipulation — React state and refs only
- Routing: `react-router-dom` v7; use `<Link>` not `<a>` for internal navigation
- All API calls include the Authorization header from the Zustand auth store
- Zod schemas live in `src/schemas/` and are imported by both forms and API functions

## Security
- Never commit `.env` — use `.env.example` as template
- No `console.log` in committed code

## Testing
- Framework: Vitest + Testing Library
- Run: `npm test` from this directory
- Test files: `.test.tsx` co-located with components
- Test user interactions and rendered output, not implementation details
- Mock API calls at the `src/api/` boundary

## Custom Skills
Use the skills in `.claude/skills/` when adding components or API calls:
- `add-component` — scaffold a React component with CVA variants
- `add-api-call` — add a typed API function + Zustand store slice
