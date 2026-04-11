# Just-In-Time

A React time tracking app integrated with the Moneybird accounting API. Moneybird API documentation can be found here: https://developer.moneybird.com.

## Tech Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **React Router 7** for routing
- **Mantine 9** for UI components
- **TanStack React Query 5** for server state
- **Day.js** for date manipulation
- **SCSS** for styles (with Mantine SCSS imports as additionalData)
- Deployed on **Vercel** with API proxy rewrites

## Commands

```bash
npm run dev          # Start dev server (HMR)
npm run proxy        # Start Vite proxy mode
npm run build        # tsc + vite build
npm run lint         # ESLint check
npm run lint-fix     # ESLint auto-fix
npm run prettier     # Prettier check
npm run prettier-fix # Prettier format write
npm run preview      # Preview production build
```

## Project Structure

```
src/
├── assets/
├── components/          # Shared/reusable UI components
├── modules/
│   ├── just-in-time/    # Local activities (localStorage)
│   │   ├── adapters/    # localStorage read/write
│   │   ├── components/
│   │   ├── models/      # TypeScript interfaces
│   │   └── query-hooks/
│   └── moneybird/       # Moneybird API integration
│       ├── adapters/    # Fetch wrappers per resource
│       ├── context/     # APISettingsContext
│       ├── hooks/
│       ├── models/
│       ├── providers/   # APISettingsProvider
│       └── query-hooks/
└── routes/              # Page components
    ├── layout/          # App shell + navbar
    ├── setup/           # Login → administration selection
    ├── time-logger/     # Main time entry creation
    ├── time-entries/    # Time entries list + filters
    ├── projects/
    └── activities/
```

## Architecture Patterns

### Adapters

Pure functions that abstract data access. Moneybird adapters take a `fetcher` function as dependency injection. `just-in-time` adapters wrap localStorage.

### Query Hooks

React Query wrappers in `modules/*/query-hooks/`. Convention: return `{ query, mutation }`. Use `staleTime: Infinity` — no automatic refetching.

### Auth

- API token + selected administration stored in localStorage via `APISettingsContext`
- Protected routes check `isLoggedIn` and `administration`
- Setup flow: Login → Select Administration → App

### API Proxy

Vite dev server and Vercel both rewrite `/api/moneybird-proxy/*` → `https://moneybird.com/api/`. Bearer token passed via headers.

## Code Style

- Prefer functional components with hooks
- Use CSS Modules
- Prettier: single quotes, semi-colons, trailing commas, 100 char print width
- TypeScript strict mode with `noUnusedLocals` / `noUnusedParameters`
- Format on save is configured in `.vscode/settings.json`
