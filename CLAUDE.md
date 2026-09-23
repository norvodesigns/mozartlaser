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
  `--ease-expo`), five interaction durations (`--dur-press` … `--dur-panel`), and for
  things arriving on the page `--dur-entrance`, `--dur-reveal`, `--stagger`/`--stagger-child`
  and the `--rv-y*` distances. Use those; don't write a raw `cubic-bezier` or a bare
  millisecond value into a rule.
  - **Entrances are unhurried.** The first pass (860ms on the expo curve) read as
    stressful: expo lands most of the movement in the first 200ms, which is a snap.
    Entrances travel on `--ease-out-soft` over `--dur-entrance`. Hover and press keep
    the short interaction durations — slow arrivals, quick responses.
  - **Entrances and scroll reveals go through `reveal()`** (`lib/reveal.ts`) — never a
    CSS animation that starts on its own, and never a React effect. A CSS animation's
    clock starts before a slow phone paints its first frame, so it's over before anyone
    sees it; an effect runs at hydration, after content is already on screen. The
    engine in `lib/motion.ts` runs inline in `<head>`: it arms before the first paint,
    starts the first screen once the fonts are in, and holds anything that *is* its
    photograph until the photograph decodes. Pick a kind (`rise`, `frame`, `object`,
    `stagger`, `wipe`, `mask`, `line`, `fade`); the visuals live under REVEAL in
    `site.css`. Pin a delay only for first-screen choreography (the hero).
  - **Nothing large fades in from transparent.** Chrome doesn't count an element as
    painted until an opacity-from-0 entrance has fully finished, which cost every page
    about a second of LCP. Copy, headings, frames and photographs are uncovered with a
    `clip-path` mask plus movement; `fade` and faded stagger children are for small
    furniture (buttons, links, chips, captions). The one exception is the product
    card: a grid of cards each moving and unmasking was dizzying, so cards only
    fade (`reveal('fade')`), photo included. Keep it that way.
  - Reveals animate `translate`, `scale`, `clip-path` and `opacity`; hover and press own
    `transform` and `box-shadow`. Keep it that way so the two never fight.
  - Hover displacement goes inside `@media (hover: hover) and (pointer: fine)`, with
    `:focus-visible` outside it. On a phone `:hover` sticks after a tap.
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
    there; don't start a second block. Page reveals need nothing there: the engine
    never arms under that preference.
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
- `lib/products.ts` — the catalogue, single source of truth. Server-side only in
  practice: client components import `lib/format.ts` for prices, and receive a
  trimmed product (`toCardProduct`) rather than the whole record.
- `lib/custom.ts` — made-to-order pricing rules.
- `lib/motion.ts` / `lib/reveal.ts` — the entrance engine and its markup helper.
- Every route is static. Read search params on the client inside their own
  `<Suspense>` (see `ProductsBrowser`, `CreateFlow`), not in a page's props —
  that makes the route a per-request render and stops `<Link>` prefetching it.

## Git

Work on a branch and open a PR. mozartlaser.com is served from `main` through
Vercel, so a push to `main` publishes to the live storefront.
