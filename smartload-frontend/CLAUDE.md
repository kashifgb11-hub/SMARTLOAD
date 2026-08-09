# SmartLoad Frontend

React frontend for the SmartLoad building energy prediction tool — "Predict Building Energy Demand Before You Build." Part of an MSc dissertation project. Consumes the FastAPI backend (see the sibling `backend/` project, both under the `SmartLoad/` root) which serves Ridge Regression heating/cooling load predictions, SHAP attributions, and optimization recommendations.

A single-page scrolling app — there is no router. The navbar smooth-scrolls to sections rather than navigating between routes.

## Tech Stack

- React 18 (via Vite)
- Vite
- Tailwind CSS (custom SmartLoad color palette — see `tailwind.config.js`)
- Motion (Framer Motion) — imported as `motion/react`
- Recharts — SHAP contribution chart
- Axios — API client

## How to Run

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. Requires the SmartLoad backend running on `http://localhost:8000` (CORS is open on the backend for local dev).

## API Base URL

`http://localhost:8000` — configured in `src/api/client.js`.

## Project Structure

```
smartload-frontend/
├── CLAUDE.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx               # Stacks Navbar + Hero + EnergyPredictor + OptimizeSection + Footer, no router
│   ├── index.css             # Tailwind imports, global styles, Inter font, range-slider styling, smooth-scroll
│   ├── api/
│   │   └── client.js         # Axios instance, base URL config
│   ├── components/
│   │   ├── Navbar.jsx               # Dark, fixed navbar; IntersectionObserver-driven scrollspy + smooth scroll
│   │   ├── SliderInput.jsx           # Reusable slider, SHAP-colored track, "Unknown" toggle
│   │   ├── SelectInput.jsx           # Reusable dropdown, "Unknown" toggle
│   │   ├── PredictionDisplay.jsx
│   │   ├── EnergyRating.jsx
│   │   ├── ShapChart.jsx
│   │   ├── ExplanationList.jsx
│   │   ├── RecommendationCard.jsx
│   │   ├── BuildingIllustration.jsx  # Small illustration inside the Energy Predictor results card
│   │   ├── MissingDataNote.jsx
│   │   ├── AnimatedBuilding.jsx          # Hero section: building "drawn" stroke-by-stroke, then pulsing energy arrows
│   │   ├── FloorPlanDecoration.jsx       # Energy Predictor section: faint floor-plan sketch (bottom-right), fades in on scroll
│   │   ├── CurveDivider.jsx              # Seamless curved SVG transition between two section background colors
│   │   └── AmbientShapes.jsx             # HexagonShape/CircleShape/LineShape — CSS-only drifting background shapes
│   ├── sections/
│   │   ├── Hero.jsx                # id="home" — full-viewport dark hero, CTA buttons
│   │   ├── EnergyPredictor.jsx     # id="energy-predictor" — real-time what-if prediction (was Explorer page)
│   │   ├── OptimizeSection.jsx     # id="optimize" — optimization recommendations (was Optimize page)
│   │   └── Footer.jsx
│   └── utils/
│       ├── constants.js      # Single source of truth: feature ranges, labels, defaults, options
│       └── scroll.js         # scrollToSection(id) — scrollIntoView({ behavior: 'smooth' })
└── README.md
```

## Navigation

- No `react-router-dom` — it was removed. The whole app is one scrolling page (`App.jsx` just stacks the sections).
- Section ids: `home` (Hero), `energy-predictor` (EnergyPredictor), `optimize` (OptimizeSection). The navbar's "Home" / "Energy Predictor" / "Optimize" links call `scrollToSection(id)` from `utils/scroll.js`.
- Each section root has Tailwind's `scroll-mt-16` so `scrollIntoView` (and any future anchor jump) accounts for the fixed navbar's height (64px / `h-16`) instead of scrolling the section top under the navbar.
- `Navbar.jsx` highlights the active link via an `IntersectionObserver` watching all three section elements with `rootMargin: '-96px 0px -55% 0px'` — this creates a thin detection band near the top of the viewport (below the navbar) so whichever section occupies that band is treated as "active." It also toggles `shadow-lg` once `window.scrollY > 100`.

## Design System Notes

- Colors, typography sizes, and spacing conventions are defined in `tailwind.config.js` under `theme.extend` (custom `primary`, `accent.*`, `text.*`, `border` colors and `brand`/`page-heading`/`card-heading`/`body`/`number` font sizes) — use these tokens rather than one-off hex values in components. The Hero/content sections also lean on default Tailwind colors (`blue-200`, `blue-100`) and a handful of arbitrary hex values that aren't in the palette — that's intentional, they're one-off section backgrounds rather than reusable tokens.
- `src/utils/constants.js` is the single source of truth for the 8 model features (key, label, type, range/options, default). Both `EnergyPredictor` and `OptimizeSection` and all input components read from it — don't hardcode feature metadata elsewhere.
- No browser storage APIs (localStorage/sessionStorage) are used anywhere — all state lives in React state.
- Animations respect `prefers-reduced-motion` via `MotionConfig reducedMotion="user"` in `App.jsx` plus a global CSS media query fallback in `index.css` (also forces `scroll-behavior: auto`).
- Decorative background SVGs (`AnimatedBuilding`, `FloorPlanDecoration`) are `absolute`-positioned (or, for `AnimatedBuilding`, a normal flex child — see the Hero note below) inside their own `relative` section root — not `fixed` — since with multiple stacked scrolling sections, a `fixed` decorative layer would bleed across section boundaries instead of staying scoped to one section. `OptimizeSection` has no decorative background SVG of its own — one (`EnergyFlowIllustration`) was tried and removed for looking out of place; don't re-add one without checking with the user first.

### Color arc across sections

The page is designed as one continuous color gradient rather than alternating flat blocks: dark blue hero (`#1E3A5F` → `#0F2744`) → soft blue-grey Energy Predictor (`#EFF4F8`) → slightly deeper blue-grey Optimize (`#E8EEF4`) → dark blue footer (`#1E3A5F`). Seams between sections use `CurveDivider` (a curved SVG filled with the *next* section's color, absolutely positioned at `bottom-0` of the *current* section) or, for the Energy-Predictor-to-Optimize seam specifically, a plain `bg-gradient-to-b` overlay — both approaches rely on the adjacent section starting with that exact solid color so there's no visible seam. If you change a section's background color, update whichever divider/gradient feeds into it.

### Card styling

All cards (input/results panels, the Optimize form card, `RecommendationCard`) use the same treatment: `bg-card` (white) + `shadow-md` (`hover:shadow-lg` where hoverable) + `border border-blue-100/50`. This is deliberate now that section backgrounds are colored blue-greys rather than white — keep new cards consistent with this rather than the older `shadow-sm`/`border-border` combo.

### Container alignment: EnergyPredictor and OptimizeSection must match

Both sections use the identical outer container — `max-w-7xl mx-auto px-6` — specifically so the "Energy Predictor" and "Optimize Your Building" headings (and their description paragraphs), *and* the cards below them, all line up on the same left/right edges when scrolling between them. `OptimizeSection`'s form card, the post-Analyze "Your Current Design" card, the "Optimization Opportunities" label, and the recommendation-card list (or its "already optimized" empty state) are all full-width within that shared 7xl container — no inner `max-w-4xl`/`mx-auto` centering. An earlier iteration centered those pieces in a narrower `max-w-4xl` column; that was reverted per explicit user request in favor of full width matching Energy Predictor's cards. Don't reintroduce the narrower centered treatment without checking first.

### Density constraint: Energy Predictor must fit one 1366×768 viewport

Energy Predictor's two-column card row is sized to fit within ~704px — the viewport height at a common 1366×768 laptop resolution, minus the 64px fixed navbar — without needing to scroll within the section. This is why `SliderInput`/`SelectInput`/`PredictionDisplay`/`EnergyRating`/`ExplanationList` all use compact `text-xs`/`text-sm` sizing and tight (`py-1`, `p-3`/`p-4`) spacing rather than the more spacious sizing used elsewhere, and why `ShapChart` shows only the top 5 features (sorted by `Math.abs(value)`, via `.slice(0, 5)`) at a reduced `height={170}` instead of all 8 at 280px. `OptimizeSection` is no longer under this same one-viewport constraint (its "How It Works" filler content was removed, and its cards are now full-width rather than needing to share vertical space with a narrow centered column), but its `NumberField`/`CategoryField` inputs and card padding were left at the same compact sizing for visual consistency. `OptimizeSection`'s post-Analyze results list (`RecommendationCard`s, up to 8 of them) is expected to scroll.

If you add content to Energy Predictor or loosen any of this compact styling, re-measure at 1366×768: `document.getElementById('energy-predictor').getBoundingClientRect()` — `bottom` must stay ≤ ~768. Don't just eyeball a screenshot; a `ResponsiveContainer` chart or a `YAxis` label (`ShapChart`'s `YAxis width` has clipped feature-name text before at font sizes below 10-11px combined with `width={110}` — it's now `width={130}` with `tick fontSize 10`) can silently overflow or clip in ways that are easy to miss at a glance.

### Ambient motion

- `AmbientShapes.jsx` (`HexagonShape`/`CircleShape`/`LineShape`) are intentionally CSS-`@keyframes`-animated (`.float-shape-1/2/3` in `index.css`), not Motion — they drift continuously for as long as they're mounted, and animating that with Motion would mean tracking it on every scroll frame. Only 2-3 of these should exist on the page at once, scattered across the content sections (not the hero, not one-per-section).
- The section heading accent bar and `FloorPlanDecoration` use Motion's `whileInView` + `viewport={{ once: true }}` instead, since those only need to fire once when scrolled into view.
- The Hero heading (`Hero.jsx`) reveals word-by-word via `HEADING.split(' ').map(...)`, each word an independent `motion.span` with a `0.05s`-per-word delay stagger. If the heading copy changes, it still works automatically — no per-word config needed.

### Hero layout: split two-column, not centered

`Hero.jsx` is a left-text / right-illustration split (`flex items-center justify-between` inside a `max-w-7xl mx-auto` wrapper — the same container width used by `EnergyPredictor`/`OptimizeSection`), not a centered stack. Left column (`w-7/12`) is deliberately minimal: word-by-word heading (`text-4xl`), a single one-line subheading (`text-lg text-blue-200/80`), then the two CTA buttons — nothing else. A row of 3 glassmorphism benefit cards and, later, a plain vertical list of 3 benefit lines were both tried and removed (in that order) for wasting vertical space and/or colliding with the illustration on laptop-height screens; don't re-add either without checking 1366×768 first. Right column (`w-5/12`, `hidden lg:flex`): `AnimatedBuilding`, sized via responsive Tailwind width classes (`w-[230px] lg:w-[270px] xl:w-[320px]`, deliberately compact — an earlier, larger size crowded the column) and centered in its own column via `flex items-center justify-center` — it is a normal flow child, not an absolutely-positioned overlay, so it can't collide with the text column the way earlier iterations did. `pt-20` on the content wrapper guarantees clearance under the fixed navbar regardless of viewport height, and `items-center` on the row vertically centers both columns in whatever space is left. There is no scroll-indicator chevron in the hero (removed).

## Testing note: Playwright `fullPage` screenshots and `whileInView`

A `page.screenshot({ fullPage: true })` taken without first actually scrolling through the page will often show `whileInView` sections (Energy Predictor, Optimize) as empty gaps — Playwright's full-page capture doesn't reliably fire the `IntersectionObserver` callbacks Motion's `whileInView` depends on while it stitches the screenshot together. This is a test-tooling artifact, not an app bug. To get an accurate full-page screenshot, manually scroll through the page in steps (`window.scrollTo` in a loop with small waits) before capturing, or just screenshot each section individually after scrolling/clicking to it.

## Notes for Future Changes

- If the backend's feature set, ranges, or response shape changes, update `src/utils/constants.js` and the relevant section/component together — they're tightly coupled to the `/predict` and `/optimize` response shapes documented in the backend's `CLAUDE.md`.
- `EnergyPredictor` auto-predicts on every input change (150ms debounce); `OptimizeSection` requires an explicit "Analyze" click since `/optimize` doesn't accept null fields.
- Adding a fourth scrolling section means: give it an `id`, add `scroll-mt-16`, add `{ id, label }` to `links` in `Navbar.jsx`, and render it in `App.jsx`.
