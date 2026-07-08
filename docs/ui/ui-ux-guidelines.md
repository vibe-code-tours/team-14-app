# UI/UX Guidelines — WorkerVoice

> This document defines the UI/UX patterns and design system for the WorkerVoice platform.

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Emerald 600 | `#059669` | Primary brand, CTAs, active states |
| Teal 600 | `#0d9488` | Gradient accents, secondary brand |
| Slate 50 | `#f8fafc` | Page background |
| Slate 900 | `#0f172a` | Primary text |
| Slate 500 | `#64748b` | Secondary text |
| Blue 100 | `#dbeafe` | Country badges (Thailand) |
| Amber 50 | `#fffbeb` | Privacy/security notices |

### Typography

- **Font Family:** Inter (Google Fonts)
- **Headings:** Bold (700), tracking-tight
- **Body:** Regular (400), leading-relaxed
- **Labels:** Semibold (600), uppercase tracking-wider for form labels

### Border Radius

- **Cards:** `rounded-2xl` (16px) or `rounded-3xl` (24px) for hero sections
- **Buttons:** `rounded-xl` (12px) or `rounded-full` for pills
- **Inputs:** `rounded-xl` (12px)

### Shadows

- **Cards:** `shadow-sm` with `border border-slate-100`
- **Hover states:** `hover:shadow-md transition-shadow`
- **Modals:** `shadow-2xl`

---

## 📐 Component Patterns

### Navigation Bar

```tsx
<nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 sticky top-0 z-10 shadow-md">
```

- Sticky positioning
- Gradient background (emerald to teal)
- Logo with globe emoji 🌏
- "Suggest" button as white pill

### Cards

```tsx
<div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
```

- White background
- Subtle border
- Hover effect with shadow increase
- Padding: `p-5` for list items, `p-6 md:p-8` for detail cards

### Rating Bars (Multi-Criteria)

```tsx
<div className="space-y-1">
  <div className="flex justify-between text-xs font-medium text-slate-500">
    <span>💰 Salary Paid On-Time</span>
    <span className="font-semibold text-slate-700">4.2</span>
  </div>
  <div className="w-full bg-slate-200 rounded-full h-2">
    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: '84%' }} />
  </div>
</div>
```

**Color coding:**
- Salary: `bg-emerald-500` (green)
- OT: `bg-amber-500` (yellow)
- Housing: `bg-blue-500` (blue)

### Review Cards

```tsx
<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition duration-300">
```

- Avatar with first letter of role
- Gradient background for avatar: `from-emerald-100 to-teal-100`
- Country flag emoji
- Rating badge: `bg-emerald-50 border border-emerald-100`
- Rating breakdown at bottom

### Modals

```tsx
<dialog className="p-0 rounded-3xl shadow-2xl backdrop:bg-slate-900/40 w-full max-w-md border border-slate-100 overflow-hidden">
```

- Use native `<dialog>` element
- Gradient header
- Privacy banner with amber background
- Form fields with `rounded-xl` inputs

### Forms

```tsx
<label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
<input className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition">
```

- Uppercase labels
- Focus ring in emerald
- Consistent padding

---

## 🎭 Animations

### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
```

Apply to main content containers on page load.

### Transitions

- **Hover effects:** `transition hover:shadow-md`
- **Button press:** `active:scale-95`
- **Progress bars:** `transition-all duration-500`

---

## 📱 Responsive Design

### Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet:** `md:` (768px+)
- **Desktop:** `lg:` (1024px+)

### Grid Patterns

```tsx
{/* Two column on tablet+ */}
<div className="grid md:grid-cols-2 gap-4">

{/* Three column on desktop+ */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Padding

- **Mobile:** `p-4`
- **Desktop:** `p-4 md:p-8`

---

## 🌍 Internationalization

### Myanmar Language Support

- Privacy banners include Myanmar text
- Form labels include Myanmar translations
- Success messages in both languages

### Country Flags

```tsx
const flags: Record<string, string> = {
  Myanmar: "🇲🇲",
  Cambodia: "🇰🇭",
  Laos: "🇱🇦",
  Vietnam: "🇻🇳",
  Thailand: "🇹🇭",
};
```

---

## 📋 Page Templates

### Home Page

1. Search hero section with large heading
2. Factory listings grid (2 columns)
3. Info section about the platform

### Factory Detail Page

1. Hero card with gradient accent line
2. Multi-criteria rating bars
3. Reviews section with write button
4. Review cards with avatars and ratings

### Factory List Page

1. Header with title
2. Search & filter bar
3. Results count
4. Factory grid (3 columns on desktop)
5. Pagination

---

## 🔒 Privacy & Security UI

### Privacy Banner

```tsx
<div className="bg-amber-50 border-b border-amber-100 p-4 text-xs flex gap-2.5 items-center text-amber-800">
  <span className="text-lg">🔒</span>
  <div>
    <strong className="block">၁၀၀% လူမည်မဖော်ပြဘဲ လျှို့ဝှက်ပေးထားပါသည်</strong>
    Your name and identity are completely safe.
  </div>
</div>
```

### Anonymous Reviews

- Use first letter of role as avatar
- Never display real names
- Show "Anonymous 🇲🇲" or role-based labels

---

## 📁 File Structure

```
src/components/
├── Navbar.tsx          # Navigation bar
├── Footer.tsx          # Footer
├── Button.tsx          # Reusable button
├── Card.tsx            # Card container
├── SuggestModal.tsx    # Suggestion form modal
├── ReviewModal.tsx     # Review form modal
├── Badge.tsx           # Status badges
├── Input.tsx           # Form input
├── Select.tsx          # Form select
└── StarRating.tsx      # Star rating display
```

---

## ✅ Checklist for New Components

- [ ] Uses Inter font family
- [ ] Follows color palette (emerald primary)
- [ ] Responsive on mobile and desktop
- [ ] Includes hover/focus states
- [ ] Uses consistent border radius
- [ ] Includes proper accessibility labels
- [ ] Supports Myanmar/English text where applicable

---

*Last updated: 2026-07-08*
