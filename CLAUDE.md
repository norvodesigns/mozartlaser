# Mozart Laser — site conventions

This site is being moved off the old black-and-gold theme onto the Mozart Laser
design system: warm bone and wood, one accent, no gold. Restraint is the brand.
When a decision is close, take the quieter one.

The system lives in a Design System artifact. Read `project/README.md` there for
the full brand book before making visual decisions; `project/tokens.json` is the
source of truth for every value — except motion, which the kit does not cover.
See the motion rule below.

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
- **Motion**: the design system's motion note ("opacity and 4–8px translation only,
  160–240ms, ease-out") describes the old static site and Caleb has asked for more
  than that on the rebuild. The rule for this repo is the motion layer at the top of
  `styles/site.css`: four easings (`--ease-out-soft`, `--ease-in-soft`, `--ease-spring`,
  `--ease-expo`) and five durations (`--dur-press` … `--dur-panel`). Use those; don't
  write a raw `cubic-bezier` or a bare millisecond value into a rule.
  - Hover displaces, press compresses. `--lift-sm`/`--lift-md`/`--lift-lg` and
    `--squish` carry those amounts. They sit off the 4px spacing scale on purpose
    and are never a substitute for spacing.
  - **No scale on product photography, still.** Cut-out product images translate and
    nothing else. Editorial photography inside an `overflow: hidden` frame may scale.
  - No parallax, no cursor effects.
  - Anything that animates in must fill forwards to its resting state, so a
    collapsed or interrupted animation can never strand an element invisible.
  - `prefers-reduced-motion` is handled by one blanket rule at the foot of
    `styles/site.css`. Add new hover displacements to the `transform: none` list
    there; don't start a second block.
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
