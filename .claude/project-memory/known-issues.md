# Known Issues

- Agency dataset is incomplete.
- Factory import requires verification.
- Search performance optimization pending.
- Province translations require review.

## Location Filtering System Issues (2026-07-30)

- **File Organization**: JSON mapping files (`province_mapping.json`, `district_mapping.json`, etc.) in project root instead of `lib/data/`
- **Duplicate Code**: `selectionMappings.ts` and `locations.ts` have overlapping functionality
- **Unused Components**: Multiple search variants created during development:
  - `CombinedSearch.tsx` (unused)
  - `SearchWithDropdown.tsx` (unused)
  - `CascadingLocationFilter.tsx` (unused)
  - `CombinedSearch3.tsx` (active)
- **Typo**: `all_reginon` folder name in seed script (`prisma/seed-all-factories.ts`)
- **API Translation Overhead**: English→Thai conversion adds processing time to API calls

## Fixed Issues (2026-07-30)

- ✅ **JSX Syntax Error**: Fixed `))` to `{))}` in `app/factories/page.tsx`
- ✅ **TypeScript Errors**: Added type assertions for JSON imports in `lib/locations.ts`
- ✅ **Suspense Boundary**: Refactored `FactoriesPage` to use `<Suspense>` wrapper
