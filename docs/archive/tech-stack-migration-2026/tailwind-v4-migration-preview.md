# Tailwind CSS v4 Migration Preview

> Project: WorkerVoice — Migrant Review Platform
> Date: July 7, 2026
> Author: Release Engineer
> Status: **MIGRATION COMPLETE — READY FOR COMMIT**

---

## 1. Migration Method

**Used official Tailwind CSS upgrade tool:** `npx @tailwindcss/upgrade`

The tool automatically:
- Migrated JavaScript configuration to CSS
- Updated PostCSS configuration
- Renamed deprecated utility classes
- Updated template files
- Installed required packages

---

## 2. Package Changes

| Package | Before | After | Action |
|---------|--------|-------|--------|
| `tailwindcss` | 3.4.19 | **4.3.2** | Updated |
| `@tailwindcss/postcss` | — | **4.3.2** | Added |
| `autoprefixer` | 10.4.20 | — | **Removed** |
| `prettier-plugin-tailwindcss` | 0.6.12 | **0.8.0** | Updated |

**Note:** `postcss` package was NOT removed (still required by Next.js).

---

## 3. Config Changes

### Files Deleted

| File | Reason |
|------|--------|
| `tailwind.config.js` | Config moved to CSS (`@theme` directive) |

### Files Updated

| File | Change |
|------|--------|
| `postcss.config.js` | `tailwindcss` + `autoprefixer` → `@tailwindcss/postcss` |

### New Configuration (in `app/globals.css`)

```css
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

---

## 4. CSS Changes

### `app/globals.css` Rewrite

| Before (v3) | After (v4) |
|-------------|------------|
| `@tailwind base;` | `@import 'tailwindcss';` |
| `@tailwind components;` | *(included in import)* |
| `@tailwind utilities;` | *(included in import)* |
| `@layer utilities { .text-balance { ... } }` | `@utility text-balance { ... }` |
| `:root { ... }` | Moved to `@layer base` |

### Border Color Compatibility

Added v3 compatibility styles for default border color:

```css
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: var(--color-gray-200, currentcolor);
  }
}
```

---

## 5. Utility Class Changes

### Renamed Classes (6 files)

| File | Before | After |
|------|--------|-------|
| `src/components/Card.tsx` | `shadow-sm` | `shadow-xs` |
| `src/components/Navbar.tsx` | `shadow` | `shadow-sm` |
| `src/components/Button.tsx` | `focus:outline-none` | `focus:outline-hidden` |
| `src/components/Input.tsx` | `focus:outline-none` | `focus:outline-hidden` |
| `src/components/Select.tsx` | `focus:outline-none` | `focus:outline-hidden` |
| `app/page.tsx` | `border-black/[.08]` | `border-black/8` |

---

## 6. Files Modified

| File | Lines Changed | Type |
|------|---------------|------|
| `package.json` | 3 | Package updates |
| `package-lock.json` | ~1000 | Lock file |
| `postcss.config.js` | 2 | Config update |
| `app/globals.css` | 43 | CSS rewrite |
| `src/components/Card.tsx` | 1 | Class rename |
| `src/components/Navbar.tsx` | 1 | Class rename |
| `src/components/Button.tsx` | 1 | Class rename |
| `src/components/Input.tsx` | 1 | Class rename |
| `src/components/Select.tsx` | 1 | Class rename |
| `app/page.tsx` | 1 | Syntax update |

**Total: 10 files modified**

---

## 7. Files Removed

| File | Reason |
|------|--------|
| `tailwind.config.js` | Config moved to CSS |

---

## 8. Validation Results

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Passed |
| `npm run lint` | ✅ Passed (0 errors) |
| `npx tsc --noEmit` | ✅ Passed (0 errors) |

---

## 9. Rollback Plan

```bash
# Rollback to Phase 3
git checkout feature/tech-stack-migration~1 -- package.json postcss.config.js app/globals.css src/components/Card.tsx src/components/Navbar.tsx src/components/Button.tsx src/components/Input.tsx src/components/Select.tsx app/page.tsx
git checkout feature/tech-stack-migration~1 -- tailwind.config.js
rm postcss.config.mjs 2>/dev/null
npm install
```

---

## 10. Visual Regression Summary

| Change | Visual Impact |
|--------|---------------|
| `shadow-sm` → `shadow-xs` | Slight shadow size reduction on cards |
| `shadow` → `shadow-sm` | Slight shadow size reduction on navbar |
| `focus:outline-none` → `focus:outline-hidden` | No visual change (same behavior) |
| `border-black/[.08]` → `border-black/8` | No visual change (same opacity) |
| Border color compatibility | No visual change (v3 defaults preserved) |

**Overall visual impact: Minimal**

---

**Migration complete. Ready for commit.**
