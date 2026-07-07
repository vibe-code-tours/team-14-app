# Tailwind CSS v4 Migration Impact Report

> Project: WorkerVoice — Migrant Review Platform
> Date: July 7, 2026
> Author: Release Engineer
> Status: **AUDIT COMPLETE — READY FOR APPROVAL**

---

## 1. Current Configuration

### tailwind.config.js

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
```

**Customizations:**
- Font family extensions only
- No custom colors
- No custom spacing
- No custom animations
- No plugins

### postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 2. Migration Impact Analysis

### Files That Will Change

| File | Change | Reason |
|------|--------|--------|
| `package.json` | Update versions, add `@tailwindcss/postcss`, remove `autoprefixer` | New package structure |
| `postcss.config.js` | **DELETE** | Replaced by new config format |
| `tailwind.config.js` | **DELETE** | Config moves to CSS |
| `app/globals.css` | **REWRITE** | New import syntax + config |

### Files That Will NOT Change

| File | Reason |
|------|--------|
| `src/components/*.tsx` | Only 1 class affected (`shadow-sm` → `shadow-xs`) |
| `app/layout.tsx` | No Tailwind-specific changes |
| `app/page.tsx` | No Tailwind-specific changes |
| All API routes | No Tailwind usage |

### Deprecated Utility Classes Found

| Class | Location | Replacement |
|-------|----------|-------------|
| `shadow-sm` | `src/components/Card.tsx:10` | `shadow-xs` |

**Total deprecated classes: 1**

### Renamed Utility Classes Found

| Class | Location | New Class |
|-------|----------|-----------|
| `shadow-sm` | `src/components/Card.tsx:10` | `shadow-xs` |

**Total renamed classes: 1**

### Behavior Changes Found

| Class | Location | Impact |
|-------|----------|--------|
| `space-x-2` | `src/components/Navbar.tsx:10` | Selector changes (margin-bottom instead of margin-top) |
| `space-x-4` | `src/components/Navbar.tsx:10` | Same as above |

**Note:** These are horizontal spacing utilities (`space-x`), not vertical (`space-y`). The behavior change affects `margin-left` vs `margin-right` direction, but since these are flex container children with `gap-2`, the impact is minimal.

### Custom Theme Values

| Category | Values | Migration |
|----------|--------|-----------|
| Font family | `sans: ["var(--font-geist-sans)"]`, `mono: ["var(--font-geist-mono)"]` | Move to `@theme` |
| Custom CSS variables | `--foreground-rgb`, `--background-start-rgb`, `--background-end-rgb` | Keep as-is (not Tailwind theme) |
| Custom utilities | `.text-balance` | Convert to `@utility` |

### Plugin Compatibility

| Plugin | Status |
|--------|--------|
| `autoprefixer` | **REMOVE** (bundled in Tailwind 4) |
| `prettier-plugin-tailwindcss` | Update to 0.8.0 (compatible with v4) |
| Third-party plugins | None installed |

### Expected Visual Changes

| Change | Impact | Mitigation |
|--------|--------|------------|
| `shadow-sm` → `shadow-xs` | Slight shadow size reduction | Manual update in Card.tsx |
| Default border color | `gray-200` → `currentColor` | Add explicit border colors or restore v3 default |
| Default ring width | `3px` → `1px` | Not used in project |
| Button cursor | `pointer` → `default` | Not used in project |
| Placeholder color | `gray-400` → current text at 50% | Not used in project |

---

## 3. Risk Assessment

| Risk | Probability | Impact | Severity |
|------|-------------|--------|----------|
| `shadow-sm` → `shadow-xs` visual change | High | Low | **Low** |
| `space-x` behavior change | Low | Low | **Low** |
| Default border color change | Medium | Medium | **Medium** |
| `@layer utilities` → `@utility` | High | Low | **Low** |
| PostCSS plugin change | High | Low | **Low** |

**Overall Risk Rating: LOW**

---

## 4. Migration Plan

### Phase A: Dependencies

1. Update `package.json`:
   - `tailwindcss`: 3.4.19 → 4.3.2
   - Add `@tailwindcss/postcss`: latest
   - Remove `autoprefixer`
   - Update `prettier-plugin-tailwindcss`: 0.6.12 → 0.8.0

2. Run `npm install`

3. Run official upgrade tool: `npx @tailwindcss/upgrade`

### Phase B: Configuration

1. Delete `tailwind.config.js`
2. Delete `postcss.config.js`
3. Create new `postcss.config.mjs`:
   ```javascript
   export default {
     plugins: {
       "@tailwindcss/postcss": {},
     },
   };
   ```

### Phase C: CSS Entry File

Rewrite `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* Restore v3 defaults for border color */
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@utility text-balance {
  text-wrap: balance;
}
```

### Phase D: Component Updates

1. `src/components/Card.tsx`: Change `shadow-sm` → `shadow-xs`

### Phase E: Validation

1. `npm run build`
2. `npm run lint`
3. `npx tsc --noEmit`
4. Visual inspection

---

## 5. Files Changed Summary

| File | Action | Lines Changed |
|------|--------|---------------|
| `package.json` | Modify | ~5 |
| `postcss.config.js` | Delete | -7 |
| `tailwind.config.js` | Delete | -16 |
| `app/globals.css` | Rewrite | ~45 |
| `src/components/Card.tsx` | Modify | 1 |

---

## 6. Rollback Instructions

```bash
# Rollback to Phase 3
git checkout feature/tech-stack-migration~1 -- package.json postcss.config.js tailwind.config.js app/globals.css src/components/Card.tsx
rm postcss.config.mjs
npm install
```

---

**Awaiting approval to proceed with migration.**
