# Celebrare Photo Gallery — Frontend Intern Assignment

A responsive React photo gallery built to match the supplied pre-screening assignment.

## Requirements covered

- React + Vite project with Tailwind CSS (no component library).
- Fetches 30 photos from `https://picsum.photos/v2/list?limit=30`.
- Loading spinner and visible error state.
- Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop.
- Displays photo, author name, and a heart button.
- Real-time author-name search using already-fetched data.
- Favourites managed with `useReducer` and persisted in `localStorage`.
- Fetch logic extracted into `useFetchPhotos`, returning `photos`, `loading`, and `error`.
- `useCallback` for the search handler and `useMemo` for filtered photos.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

