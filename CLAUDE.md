# Mozart Laser — site conventions

This site is being moved off the old black-and-gold theme onto the Mozart Laser
design system: warm bone and wood, one accent, no gold. Restraint is the brand.
When a decision is close, take the quieter one.

The system lives in a Design System artifact. Read `project/README.md` there for
the full brand book before making visual decisions; `project/tokens.json` is the
source of truth for every value.

## Rules

- **Never hardcode a colour, space, radius or shadow.** Use the custom properties
  in `css/tokens.css`. If a value you need isn't there, it belongs in the design
  system first, not in a stylesheet.
- **No gold, anywhere.** `#c9a227` and friends are gone. The single accent is
  `--ember` (`#7a4a22`), the scorch an engraved line leaves in poplar. It appears
  on the primary button, links and active nav — nothing else. More than one ember
  element above the fold means one too many.
- **Kill the gold cursor dot/ring** (`initCursor`). It does not belong in this system.
- **Surfaces**: page is `--surface`; alternating bands `--surface-sunken`; cards
  `--surface-raised` with a `--line` hairline and no shadow at rest. Dark bands and
  the footer are `--surface-inverse` with `--ink-inverse` text.
- **Text**: body `--ink`, supporting `--ink-muted`, material/meta notes
  `--ink-subtle`. Never put `--ink-subtle` on anything a customer needs in order to buy.
- **Borders**: `--line` for decorative hairlines, `--line-strong` for control
  borders (inputs, secondary buttons). They are not interchangeable — `--line`
  fails contrast as a control border.
- **Type**: `Cormorant Garamond` (display) and `Work Sans` (body/UI), both from
  Google Fonts. Headings use the display face; all running copy is 16/26 Work Sans.
  Italicise exactly one word per heading — that's the brand's emphasis move.
- **Radius**: `--radius-md` (4px) is the ceiling for a control. Product images are
  square-cornered.
- **Spacing**: everything lands on the 4px scale (`--space-1` … `--space-10`).
  Sections are `--space-9` top and bottom on desktop.
- **Dark theme is real, not an inversion.** `--ember` lightens in dark, so fills
  take `--on-ember`, never literal white. Any new colour pair must clear 4.5:1 in
  both themes (3:1 for borders, focus rings and icons).
- **Buttons** use the inverse-fill hover in `css/tokens.css`: the fill sweeps in
  from the left and the colours swap. Don't add a different hover treatment.
- **Motion**: opacity and 4–8px translation only, 160–320ms, ease-out. No parallax,
  no scale-on-hover for product images. Respect `prefers-reduced-motion`.
- **Voice**: plain sentences, no exclamation marks, no "luxury/premium/elevate/
  curated/artisanal". Say the material and the turnaround before you say it's lovely.
  Sentence case except eyebrow lines, which are uppercase in the markup. No emoji.

## Stack

Next.js 14 (App Router), TypeScript, plain CSS. No CSS framework.

This kit was written for the previous static site and its stack note said
"static HTML/CSS/JS, keep it that way". Caleb chose the Next.js rebuild before
the kit arrived and confirmed it afterwards, so the design in this kit applies
and the stack note does not. The reason is the booking module: the storefront
takes its catalogue from there in the next phase, and `lib/products.ts` is the
seam it plugs into.

- `styles/tokens.css` — the kit's generated file. Don't hand-edit values. Only
  the font variables and `--logo` differ, both for Next's asset handling.
- `styles/components.css` — the kit's `.ml-*` classes, used for fields.
- `styles/site.css` — page and chrome layout, tokens only.
- `lib/products.ts` — the catalogue, single source of truth.
- `lib/custom.ts` — made-to-order pricing rules.

## Git

Work on a branch and open a PR. mozartlaser.com is served from `main` through
Vercel, so a push to `main` publishes to the live storefront.
