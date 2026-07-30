# Technical Debt

- Redis cache not implemented.
- Email verification pending.
- AI review moderation not implemented.
- Search indexing not implemented.
- Monitoring dashboard pending.

## Location Filtering System Debt (2026-07-30)

- **Consolidate Mapping Files**: Move JSON files from project root to `lib/data/locations/`
- **Merge Duplicate Utilities**: Combine `selectionMappings.ts` and `locations.ts` into single file
- **Remove Unused Components**: Delete `CombinedSearch.tsx`, `SearchWithDropdown.tsx`, `CascadingLocationFilter.tsx`
- **Fix Folder Typo**: Rename `all_reginon` to `all_region` in seed script
- **Optimize API Translation**: Consider caching mapping files or using database joins
- **Add Error Handling**: Handle missing mapping files gracefully in API route
