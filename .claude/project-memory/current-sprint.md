# Current Sprint

## Sprint

Sprint 1

## Goal

- Landing Page
- Company Search
- Company Detail
- Anonymous Review

## Status

In Progress

## Current Priority

Company Search - Location Filtering System

## Owner

Development Team

## Recent Work (2026-07-30)

### Location Filtering Feature
- Implemented cascading Region→Province→District search filters
- Created `CombinedSearch3` component with dropdown UI
- Added English→Thai translation for API queries
- Created mapping files for province/district data
- Updated landing page and factories list with new filters

### Files Created
- `src/components/CombinedSearch3.tsx` - Active search component
- `src/lib/selectionMappings.ts` - Location mappings
- `lib/locations.ts` - Location utilities (duplicate)
- `prisma/seed-all-factories.ts` - Excel import script
- JSON mapping files at project root

### Files Modified
- `app/page.tsx` - Uses CombinedSearch3 with filter chips
- `app/api/factories/route.ts` - English→Thai translation
- `app/factories/page.tsx` - Accepts search params from URL, added Suspense boundary
- `src/components/FactoryFilters.tsx` - Simplified filters
- `lib/locations.ts` - Added TypeScript type assertions

### Build Errors Fixed
1. JSX syntax error in `factories/page.tsx` (missing `{` in map closing)
2. TypeScript errors in `locations.ts` (JSON import typing)
3. Next.js Suspense boundary requirement for `useSearchParams()`
