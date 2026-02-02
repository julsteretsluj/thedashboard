# SEAMUNs branding

This dashboard is styled to match **seamuns.site** (South East Asia Model United Nations) so it feels like part of the same product.

**Capitalization:** Use **SEAMUNs** for the brand and app name (“SEAMUNs Dashboard”). Use **seamuns.site** (all lowercase) when referring to the domain or URL.

## Palette

- **Brand / accent:** `#2563eb` (blue) — primary actions, links, active states
- **Gold:** `#d4a853` — delegate-focused actions, highlights
- **Background:** dark base (`#0c0e12`), elevated (`#14171f`), cards (`#1a1e28`)
- **Text:** `#e8eaef` primary, `#8b92a4` muted
- **Success / danger:** green and red for status

Defined in `src/index.css` as CSS variables (`--brand`, `--brand-soft`, `--accent`, `--gold`, etc.). To tweak for seamuns.site, change the `:root` values there.

## Typography (aligned with seamuns.site)

- **Sans:** Inter (body, UI)
- **Serif:** Source Serif 4 (headings, logo feel)

## Links to seamuns.site

- Header: “seamuns.site” link next to the logo
- Home: “Part of SEAMUNs” in the tagline
- Footer: “Part of SEAMUNs — Model UN conferences across South East Asia”

Keeping these and the palette in sync with seamuns.site maintains consistent branding across the main site and this dashboard.

## Light / dark and color themes

- **Default:** Light mode (seamuns.site-style) — light gray background (`#f1f5f9`), white cards, dark text.
- **Theme selector:** Appearance (Light / Dark) + Color theme (Default, Health, War, Women, Nature, Peace, Economy, Education, Human rights). Both persisted in localStorage.

## UI patterns (seamuns-style)

- **Header:** Taller bar (h-16), nav in a pill strip (rounded container with pill-style active tab).
- **Cards:** `.card-block` — `--radius-card` (1rem), border, `--bg-card`, light shadow.
- **Buttons / nav:** Rounded rectangles (`rounded-lg`, `--radius-btn`) for nav items and sidebar section buttons; active = filled brand/gold.
- **Section headings:** `.section-heading` (serif, 1.5rem) + optional `.section-subtitle` (muted, 0.875rem).
- **Page bars:** Chair/Delegate page title bars use a thin bottom shadow for separation.
