# Local-First Users App

This Next.js application demonstrates a small local-first app with offline support. User data is fetched from [Random User API](https://randomuser.me/) and cached locally using IndexedDB (via Dexie). Zustand manages global state and Tailwind CSS is used for styling.

## Features

- Fetches users from the API and caches them in IndexedDB
- Client-side pagination
- Global state management with Zustand
- Mark users as favourite and persist this to IndexedDB
- Manual offline mode toggle
- Search, sort and filter users
- Dark mode support
- Basic Jest + React Testing Library setup

## Getting Started

Install dependencies and start the dev server:

```bash
pnpm install
pnpm run dev
```

Open <http://localhost:3000> in your browser.

### Testing

Run unit tests with:

```bash
npx jest
```

_Note: running the test suite requires `jest-environment-jsdom`. If it is missing, install it with `npm install --save-dev jest-environment-jsdom`._

### Offline/Fallback

To simulate offline mode, use the **Go Offline** button in the UI. The app will fall back to the most recently cached data when the API is unreachable or offline mode is enabled.

### Known Issues / Improvements

- Pagination uses the API page parameter but does not keep previous pages in cache.
- Tests may fail without the `jest-environment-jsdom` package installed.
- With more time, improving type coverage and adding e2e tests would be valuable.