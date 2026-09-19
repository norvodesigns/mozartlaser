# Mozart Laser — full site redesign brief

Everything needed to rebuild mozartlaser.com to a premium standard. This document
is self-contained: every token value, component spec and interaction rule is
written out below, so no external design file is required.

---

## 1. The bar

This site sells hand-made wooden objects that people buy as gifts for someone
they love, at $6–$56. The site has to feel worth more than the objects cost. The
standard is the kind of site a serious independent studio ships: quiet,
confident, material-led, obsessively detailed. Think a good furniture maker or a
letterpress studio, not a Shopify gift store.

What that means in practice, and how the work will be judged:

- **Restraint is the brand.** When a decision is close, take the quieter one. No
  decoration that isn't carrying information.
- **Detail is where the money shows.** Optical alignment, consistent baselines,
  hairlines that land on the pixel, hover states that feel considered, focus
  rings that look designed rather than default. A page that is 95% right and has
  one misaligned card reads as cheap.
- **Generous space.** The single biggest difference between a $500 site and a
  $10k site is whitespace and typographic confidence. Sections breathe at 96px.
  Do not compress to fit more above the fold.
- **The photography is the hero.** The product shots are cut-outs on transparent
  backgrounds. Treat them as objects sitting in space, not images in boxes.
- **Nothing generic.** No stock iconography, no gradient heroes, no emoji, no
  rounded-card-with-coloured-left-border, no "Our Values" section. If a section
  could appear on any other site, cut it or make it specific to engraving.

---

## 2. What is being replaced

The current site is a static HTML/CSS/JS site with a black-and-gold theme. The
owner's verdict: the gold reads costume rather than expensive, and it doesn't
represent the business. The new direction is **luxury, natural, minimal** —
warm bone and wood, one accent, no gold.

**Keep the stack.** Static HTML, CSS and vanilla JS. No framework, no build step,
no bundler, no npm dependency. This is a deliberate constraint, not an oversight.

---

## 3. Non-negotiables — do not break these

The existing site has working commerce and SEO infrastructure. This is a visual
and structural redesign, not a rebuild. All of the following must survive and be
re-tested after the redesign:

- Cart: add/remove, quantity, totals, persistence.
- Stripe checkout and shipping rates.
- EmailJS integration — order confirmation and the email signup flyout.
- The custom-order / Create flow (multi-step JS, cart integration, FormBackend submission).
- JSON-LD structured data, meta tags, `sitemap.xml`, `robots.txt`, canonical URLs.
- Existing URLs. Do not rename pages or change paths — any change needs a redirect
  and an updated sitemap.
- Lazy loading and IntersectionObserver-driven reveals (restyle them; don't delete them).

Two things are being **removed** on purpose:

- The gold cursor dot/ring (`initCursor`). Delete it entirely.
- Every hardcoded gold value. They become tokens or they go.

---

## 4. Design tokens

These are the complete values. Light is the primary theme; both themes ship.
Declare all of these on bare `:root`, redefine under
`@media (prefers-color-scheme: dark)` and again under `[data-theme="dark"]`.
They are already written in `css/tokens.css` — use that file, don't retype them.

### Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--surface` | `#faf7f2` | `#16130f` | Page background |
| `--surface-raised` | `#fffefb` | `#1f1b15` | Cards, product tiles, popovers |
| `--surface-sunken` | `#f1eade` | `#100d0a` | Inset wells, form fields, image wells, alternating bands |
| `--surface-inverse` | `#1e1913` | `#f4efe6` | Dark bands, footer, announcement bar |
| `--ink` | `#231d16` | `#f2ece2` | Headings and body copy |
| `--ink-muted` | `#574c3e` | `#bdb1a0` | Secondary copy, nav at rest |
| `--ink-subtle` | `#6f6353` | `#9b8f7e` | Captions, material notes, meta |
| `--ink-inverse` | `#f8f4ed` | `#1e1913` | All text on `--surface-inverse` |
| `--line` | `#e5dccd` | `#332c23` | Decorative hairlines only |
| `--line-strong` | `#857761` | `#807260` | Control borders (inputs, secondary buttons) |
| `--ember` | `#7a4a22` | `#d9a273` | THE accent — primary button, links, active nav |
| `--ember-strong` | `#5c3616` | `#ecc6a1` | Hover/pressed for ember things |
| `--ember-soft` | `#f2e6d7` | `#2b2119` | Quiet accent fill: badges, callouts, selected chip |
| `--on-ember` | `#fdfaf6` | `#241a10` | Text on an ember fill — never literal white |
| `--acacia` | `#a97648` | `#c08f5f` | Material swatch, decorative only |
| `--poplar` | `#e9e1ce` | `#cfc4a8` | Material swatch, decorative only |
| `--pine` | `#dcc69c` | `#e0c9a0` | Material swatch, decorative only |
| `--success` | `#3d6b4d` | `#86b294` | In stock, order confirmed |
| `--danger` | `#9e3626` | `#e2907c` | Form errors, sale price, out of stock |
| `--focus-ring` | `#3f2a14` | `#e8c49a` | 2px keyboard focus outline |

Shadows (both barely there — separation comes from surface, line and space):

- `--shadow-raise` — light `0 1px 2px rgba(35,29,22,.06), 0 6px 16px rgba(35,29,22,.05)`; dark `0 1px 2px rgba(0,0,0,.5), 0 6px 16px rgba(0,0,0,.4)`. Card on hover only, never at rest.
- `--shadow-overlay` — light `0 12px 40px rgba(35,29,22,.14)`; dark `0 12px 40px rgba(0,0,0,.6)`. Modals, cart drawer, email flyout.

**Colour rules.**
`--ember` is the only accent in the system — it is the scorch an engraved line
leaves in poplar. It appears on the primary button, links and active nav and
nowhere else. If a page has more than one ember element above the fold, remove
one. `--line` and `--line-strong` are not interchangeable: `--line` fails
contrast as a control border. The three wood tokens are decorative swatches
only — never text, never a control fill.

### Spacing — 4px base, nothing in between

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px ·
`--space-5` 24px · `--space-6` 32px · `--space-7` 48px · `--space-8` 64px ·
`--space-9` 96px · `--space-10` 128px

Sections are `--space-9` top and bottom on desktop, `--space-8` on phones. Grid
gutters `--space-6`. Card padding `--space-5`. Hero and closing CTA get
`--space-10`. Every measurement on the site lands on this scale.

### Radius — small and nearly square

`--radius-none` 0 · `--radius-sm` 2px · `--radius-md` 4px · `--radius-lg` 8px ·
`--radius-pill` 999px

`--radius-md` is the ceiling for any control. Product images are square-cornered —
a photograph of a square board should have square corners. `--radius-pill` is for
filter chips only.

---

## 5. Typography

Two families, both from Google Fonts. No other faces.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Work+Sans:wght@400;500&display=swap">
```

- `--font-display`: `"Cormorant Garamond", "Iowan Old Style", Georgia, serif`
- `--font-sans`: `"Work Sans", ui-sans-serif, system-ui, sans-serif`

### Scale

| Style | Family | Size / line | Weight | Notes |
|---|---|---|---|---|
| `display-xl` | display | 64–72 / 62–68 | 300 | Hero line. One per page, maximum. `-0.015em` tracking |
| `display-l` | display | 44 / 48 | 300 | Page titles, section openers. `-0.005em` |
| `display-m` | display | 32 / 38 | 400 | Sub-sections, product names on a PDP, pull quotes |
| `display-s` | display | 24 / 30 | 400 | Card titles, feature headings |
| `body-lead` | sans | 18 / 30 | 400 | One standfirst paragraph under a display line |
| `body` | sans | 16 / 26 | 400 | All running copy. The default |
| `body-sm` | sans | 14 / 22 | 400 | Form hints, card meta, footer links |
| `caption` | sans | 12 / 18 | 400 | Material and dimension notes |
| `eyebrow` | sans | 11 / 14 | 500 | `0.18em` tracking, uppercase **in the markup** |
| `label` | sans | 13 / 16 | 500 | `0.06em`. Form labels, table headers |
| `button-text` | sans | 15 / 20 | 500 | `0.02em`. Every button |

### Type rules

- Headings use the display face. All running copy is `body`.
- **Italicise exactly one word per heading** — this is the brand's signature
  emphasis. "Precision *Laser* Engraved", "Gallery of *Crafted Pieces*", "From
  Idea to *Heirloom*". Two italics in one line cancels the effect.
- `eyebrow` above a display heading is the brand's other signature move. One per
  section.
- Running text sits near 65 characters; use `max-width` in `ch`.
- `text-wrap: balance` on headings, `text-wrap: pretty` on pull quotes.
- The logo's script word is part of the mark. Never set other text in a script
  face and never try to match it with a web font.
- `font-variant-numeric: tabular-nums` on prices in any aligned column, the cart
  and the character counter.

---

## 6. Components

The shared classes live in `css/components.css` (`.ml-btn`, `.ml-field`,
`.ml-card`, `.ml-badge`, `.ml-quote`, `.ml-section-head`, `.ml-trust`). Extend
that file rather than inventing per-page variants.

### Buttons — the inverse fill hover

This is the site's signature interaction and must be identical everywhere. On
hover, a fill sweeps in from the left over 320ms and the colours swap. Ship this
exactly:

```css
.btn {
  position: relative; z-index: 0; overflow: hidden; isolation: isolate;
  font-family: var(--font-sans); font-size: 15px; line-height: 20px;
  font-weight: 500; letter-spacing: .02em;
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-2); padding: var(--space-3) var(--space-5);
  border: 1px solid var(--ember); border-radius: var(--radius-md);
  background: var(--ember); color: var(--on-ember);
  text-decoration: none; cursor: pointer;
  transition: color 260ms ease-out, border-color 260ms ease-out;
}
.btn::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: var(--on-ember);
  transform: scaleX(0); transform-origin: left center;
  transition: transform 320ms cubic-bezier(.22,.7,.28,1);
}
.btn:hover::before, .btn:focus-visible::before { transform: scaleX(1); }
.btn:hover, .btn:focus-visible { color: var(--ember); }

.btn--secondary { background: transparent; color: var(--ink); border-color: var(--line-strong); }
.btn--secondary::before { background: var(--ink); }
.btn--secondary:hover, .btn--secondary:focus-visible { color: var(--surface); border-color: var(--ink); }

/* for use on --surface-inverse bands */
.btn--inverse { background: var(--ink-inverse); color: var(--surface-inverse); border-color: var(--ink-inverse); }
.btn--inverse::before { background: var(--surface-inverse); }
.btn--inverse:hover, .btn--inverse:focus-visible { color: var(--ink-inverse); }

.btn--lg { padding: var(--space-4) var(--space-7); }
.btn--sm { padding: var(--space-2) var(--space-4); font-size: 13px; line-height: 16px; }

@media (prefers-reduced-motion: reduce) { .btn, .btn::before { transition-duration: 1ms; } }
```

Notes that matter: the sweep fires on `:focus-visible` as well as `:hover`, so
keyboard users get it. `z-index: -1` on the pseudo-element keeps it behind the
label without needing a wrapper span. The reduced-motion rule collapses it to an
instant swap rather than removing the state change.

Filter chips get the same treatment at pill radius, with the selected state
(`aria-pressed="true"`) filling with `--ember` on hover instead of `--ink`.

**Button rules.** Exactly one primary per view — it is the ember element on the
page. Labels are sentence case, verb first, three words maximum. Use `<button>`
for actions and `<a>` for navigation. For an unavailable action use
`aria-disabled="true"` and keep it in the tab order with an explanation beside it.

### Cards

`.ml-card` is the whole tile as a single `<a>`, so the entire card is the target.
At rest: `--surface-raised`, a 1px `--line` border, `--radius-md`, no shadow.
On hover: `--shadow-raise` plus the product image translating up 4px over 260ms.
Media well is 1:1, `--surface-sunken`, `--space-5` padding, with the cut-out
image `object-fit: contain` inside it. Body is `--space-5` padding with the
title (`display-s`), a meta line (`caption` with a wood swatch), price, and a
`View Product` cue in `label` type and `--ember`.

Sale prices: original in `<s>` with `--ink-subtle`, new price in `--danger`.

### Fields

`.ml-field` wrapper, `.ml-field__label` bound with `for`/`id`, `.ml-field__input`
on `--surface-sunken` with a `--line-strong` border at `--radius-sm`, and at most
one of `.ml-field__hint` or `.ml-field__error`. Never a placeholder in place of a
label. Errors say what to do next, not what went wrong: "Add the rest of the
address so we can send your proof." Validate on blur and submit, never on
keystroke. Mark required fields, not optional ones.

### Trust / spec strip

The seven promises (Handcrafted in California · Custom Laser Engraving · Free
Personalization · Ships in 3–5 Days · Satisfaction Guaranteed · Design Preview
Included · Premium Hardwood Materials) run as one wrapped strip between two
hairlines, in `caption` type at `0.1em` tracking, uppercase, `--ink-muted`. No
icons, no boxes, no background, no emoji.

---

## 7. Motion

Deliberate and almost invisible. Opacity and 4–8px translation only, 160–320ms,
ease-out.

- Button fill sweep: 320ms `cubic-bezier(.22,.7,.28,1)`.
- Card hover lift: 260ms ease-out, image translates `-4px`. The card itself does
  not scale. Product images never scale on hover.
- Scroll reveals: fade plus 8px rise, staggered 60ms across a row, fired once by
  IntersectionObserver. **Every element must be visible at rest** — never park
  content at `opacity: 0` waiting on an observer, or the first paint and any
  link preview show a blank page.
- No parallax, no cursor effects, no marquees, no carousels.
- `@media (prefers-reduced-motion: reduce)` disables transforms and reveals
  everywhere and shortens transitions to 1ms.

---

## 8. Homepage — section by section

Build in this order. `index.grain.html` in this repo is the approved reference
implementation; match its structure and improve the detail.

1. **Announcement bar** — `--surface-inverse`, centred, `eyebrow` type:
   "Hand-finished in California · Est. 2024".
2. **Masthead** — sticky, `--surface`, 1px `--line` bottom border, using
   `top: env(safe-area-inset-top, 0px)`. Wordmark left; nav centre (Home,
   Products, Create, Blog, About); cart count and the primary "Create Your Gift"
   button right. Nav collapses below 960px — build a proper mobile menu (the
   reference just hides it; that gap must be closed).
3. **Hero** — centred. Eyebrow "Custom laser engraving", then
   **Precision *Laser* Engraved** at `display-xl`, then the studio description:
   "Mozart Laser is a California-based studio dedicated to the art of precision
   engraving. We work with premium hardwoods to create gifts and decor that carry
   meaning — personalized for the people who matter most." Then paired CTAs
   ("Create Your Gift" primary, "Browse Products" secondary) at `--btn--lg`, then
   a reassurance line in `caption` uppercase: "Free personalization · Design
   preview included · Ships in 3–5 days".
4. **The shelf** — three real product cut-outs (Wanderer Bookmark, Golden Gate
   Bridge Plaque, Book Dragon Coin) stood on a common baseline above a single
   `--line-strong` hairline, captioned in `caption` uppercase. This is the first
   image on the page and carries the whole first impression: get the optical
   sizing right, not the mathematical sizing. Load these three eagerly.
5. **Spec strip** — the seven promises.
6. **Products** — eyebrow "Featured Work", heading "Gallery of *Crafted Pieces*",
   a "View all products →" text link right-aligned on the same baseline, then the
   six products in a responsive grid.
7. **Process** — eyebrow "Our Process", heading "From Idea to *Heirloom*", the
   four numbered steps with the existing copy verbatim. Numbering is justified
   here because it is a real sequence.
8. **Testimonials** — eyebrow "What Customers Say", heading "Words from *Real
   People*". Peyton's quote runs large and alone as the lead; Sarah, James and
   Matt follow in a three-column row. No star graphics, no avatars, no
   quotation-mark ornaments.
9. **Craftsmanship** — the pull quote "Every mark the laser makes is a mark that
   *lasts*." beside the two About paragraphs and the 100% / 3–5 / ∞ stats above a
   hairline.
10. **Guarantee** — `--ember-soft` block, `--radius-lg`: "Not happy with your
    order? We'll make it right."
11. **Closing CTA** — full-bleed `--surface-inverse` band, `--space-10` padding,
    "Ready to *Create?*" with the $5.99 line and `.btn--inverse` "Start Your
    Custom Order", plus "Or browse ready-made products" beneath.
12. **Newsletter** — "Stay in the loop & get 5% off" with the existing EmailJS
    wiring and its real success and validation messages.
13. **Footer** — wordmark, contact line, nav, then "© 2026 Mozart Laser. All
    rights reserved."

---

## 9. The rest of the site

Carry the system through every page. Each gets the same care as the homepage.

- **Products** — filter chips at pill radius with the inverse-fill hover and
  `aria-pressed`; the same card component; a real empty state for a filter that
  matches nothing.
- **Product detail** — large cut-out on a `--surface-sunken` well, `display-m`
  name, material and dimensions in `caption` with the wood swatch, price,
  personalisation input, add-to-cart as the single primary. Cross-sell row at the
  bottom using the same cards.
- **Create** — the multi-step custom-order flow restyled. Steps get a real
  progress indicator, each field follows the field spec, and the final step
  summarises the order before submit. Consider carrying over the live engraving
  preview from the other mockup (type the text, pick a wood, see it render) —
  it is the strongest conversion asset on the site.
- **Blog** — index and post. Posts are `body` at 16/26 on a 65ch measure with
  `display-m` sub-headings. This is where the serif earns its keep.
- **About** — the craftsmanship copy, the stats, and the story of one person
  making everything. No stock photography.
- **Cart / checkout** — the drawer takes `--shadow-overlay`; line items on
  hairlines; totals in tabular numerals; the checkout button is the only primary.

---

## 10. Voice and copy

Use the real copy that exists. Do not invent testimonials, statistics, product
claims, prices or dimensions. Where a gap exists, leave a `TODO(copy):` comment
rather than writing filler.

- Plain sentences, short, no exclamation marks.
- Say the material and the turnaround before saying it's lovely. "Ships in 3–5
  days" earns more trust than "fast shipping!"
- "We" make it, "you" choose it.
- Banned words: luxury, premium (except in the existing "Premium Hardwood
  Materials" badge), elevate, curated, artisanal, bespoke, unleash, seamless.
- Sentence case everywhere except `eyebrow` lines and table headers.
- No emoji, anywhere, including alt text.
- Em dashes for asides; `·` to separate material facts.

---

## 11. Imagery

- The six product photos are cut-outs on transparent backgrounds. Treat them as
  objects in space on `--surface-sunken` wells — never crop them into photo boxes
  or add a background.
- `object-fit: contain`, `max-width: 100%`, explicit `width`/`height` attributes
  to reserve space and avoid layout shift.
- Serve WebP with a PNG fallback via `<picture>`. Source PNGs are 400KB–1MB and
  must not ship as-is.
- `loading="eager"` on the three hero shelf images, `loading="lazy"` everywhere
  below the fold, `decoding="async"` throughout.
- Alt text names the piece and its material: "Wanderer Bookmark, engraved poplar".
  Decorative images get `alt=""`.
- Any future photography: bone or linen ground, daylight, shadow falling one way,
  grain readable. No studio black, no lifestyle clutter, no gradients.

---

## 12. Accessibility — hard requirements

WCAG 2.1 AA, verified in **both** themes:

- Body text 4.5:1 against its background; 3:1 for text 24px+ or bold 19px+, and
  for every border, focus ring, icon or mark that carries meaning.
- The token pairs above are pre-verified — `--ink` on `--surface` is 15.6:1,
  `--ink-subtle` on `--surface` is 5.5:1, `--ember` on `--surface` is 6.9:1,
  `--on-ember` on `--ember` is 7.1:1, `--line-strong` on `--surface` is 4.1:1.
  Any **new** pair must be measured before it ships.
- Visible focus on every interactive element: 2px solid `--focus-ring`, 2px
  offset. Never `outline: none` without a replacement.
- Full keyboard operability: mobile menu, filter chips, cart drawer, the Create
  flow, the newsletter form. Trap focus in the drawer and modal; Escape closes;
  focus returns to the trigger.
- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per page, no
  skipped heading levels.
- `aria-pressed` on toggle chips, `aria-live` on the cart count and form status,
  `aria-describedby` wiring errors to inputs.
- `--success` and `--danger` are close in lightness, so every status carries a
  word or icon — never colour alone.
- A skip-to-content link.
- Respect `prefers-reduced-motion` throughout.

---

## 13. Performance budget

- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO, mobile,
  on the homepage.
- LCP under 2.0s on a throttled 4G profile. The LCP element is the hero shelf —
  preload those images.
- CLS under 0.05. Every image has explicit dimensions or an `aspect-ratio` box.
- Total homepage payload under 1.2MB including fonts and images.
- Font loading: `preconnect` to `fonts.gstatic.com`, `display=swap`, and only the
  weights listed above (Cormorant 300/400/500 + italic, Work Sans 400/500).
  Do not pull the full families.
- No render-blocking JS. Defer everything.
- No third-party scripts beyond what commerce already requires.

---

## 14. SEO

- Preserve every existing URL, canonical tag, JSON-LD block, `sitemap.xml` and
  `robots.txt` entry. Re-validate the structured data after the redesign.
- Product pages keep `Product` schema with price, availability and currency.
- One `<h1>` per page describing the page, not the brand.
- Title and meta description per page; the homepage keeps "Custom Laser Engraved
  Gifts & Home Decor | Mozart Laser – California".
- Open Graph and Twitter card images for sharing.
- Descriptive alt text on every product image.

---

## 15. Code conventions

```
/
├── CLAUDE.md
├── REDESIGN-BRIEF.md        ← this file
├── index.html
├── products.html, create.html, blog.html, about.html …
├── css/
│   ├── tokens.css           ← generated from the design system; do not hand-edit values
│   ├── components.css       ← shared component classes
│   └── <page>.css           ← only if a page needs more than a small inline block
├── js/
├── images/
└── Product Images/
```

- Never hardcode a colour, space, radius or shadow. If a value you need isn't a
  token, it belongs in the design system first.
- Lay out sibling groups with flex/grid and `gap`, not per-element margins.
- Watch selector specificity — no type-based selector fighting a class-based one
  over the same spacing.
- One side gutter set once on a wrapper; vertical padding via `padding-block`,
  never a `padding` shorthand that zeroes the sides.
- Mobile-first, tested at 375px, 768px, 1024px, 1440px. No horizontal scroll at
  any width.
- Close every non-void element, double-quote attributes, keep IDs stable.
- Comment why, not what.

---

## 16. Git workflow

- Commit and push directly to `main`. Do not create branches unless asked.
- One logical change per commit, with a message saying what changed and why.
- Commit working increments — do not leave the tree broken between commits.
- Do not commit `node_modules`, build artefacts, or large unoptimised images.

---

## 17. Definition of done

A page is finished when all of the following are true:

- [ ] Zero hardcoded colours, spaces, radii or shadows — tokens only.
- [ ] No gold anywhere; `initCursor` deleted.
- [ ] Both themes render correctly, verified by toggling the OS setting.
- [ ] Every text/background pair measured at 4.5:1 (3:1 for large text and
      meaningful borders) in both themes.
- [ ] Full keyboard pass: every control reachable, visible focus, logical order,
      Escape closes overlays.
- [ ] No horizontal scroll at 375px; layout holds at 375/768/1024/1440.
- [ ] Lighthouse ≥ 95 across all four categories on mobile.
- [ ] All content visible at rest; nothing waiting on scroll to appear.
- [ ] Cart, Stripe checkout, EmailJS and the Create flow all re-tested and working.
- [ ] Structured data re-validated; URLs unchanged.
- [ ] `prefers-reduced-motion` honoured.
- [ ] No placeholder or invented copy; any gap marked `TODO(copy):`.

---

## 18. Open questions — ask, don't guess

1. The Golden Gate Bridge Plaque is currently labelled "Premium hardwood" because
   the wood isn't stated anywhere. Pine or poplar?
2. The seven trust badges run as one strip; the design system's TrustRow
   component specifies three items. Trim the badges, or amend the component?
3. The wordmark is a 470×128 PNG. Is there an SVG? Needed for print, favicons and
   retina at large sizes. Until then, `images/mozartlaserlogo.png` (dark ink) and
   `images/mozartlaserlogo-light.png` (light ink, for dark theme) are what exists.
4. Is there additional product photography beyond the six front views — detail
   shots, in-use shots, scale references? A premium PDP wants three to five images
   per product.
5. Should the live engraving preview from the alternate mockup move onto the
   Create page?

Stop and ask rather than inventing an answer to any of these.
