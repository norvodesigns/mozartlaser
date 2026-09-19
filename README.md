# Mozart Laser

The Mozart Laser storefront: a Next.js 14 App Router site built on the Mozart
Laser design system.

```
app/                    routes
  layout.tsx            header, footer, cart drawer, fonts, metadata
  page.tsx              home
  products/             grid + [slug] product template
  create/               custom-order flow
  about/  blog/         editorial
  order/                post-checkout states
components/             header, footer, cart, product card, gallery
lib/
  products.ts           the catalogue — single source of truth
  posts.ts              journal posts
  custom.ts             made-to-order pricing rules
styles/
  tokens.css            every design-system token, light and dark
  components.css        the system's ml-* component layer
  site.css              layout built on the token layer
public/
  products/<slug>/      product photography
  media/                site and journal video
  brand/                the wordmark, ink and light
```

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## The design system

Colour, type, space, radius and shadow all come from the Mozart Laser design
system and live in `styles/tokens.css`. Nothing in the site sets a raw colour
or a size off the scale — if a value is needed that is not in the tokens, the
design system is the place to add it.

`styles/components.css` is the system's component layer as supplied. Treat it
as read-only: site-specific layout belongs in `styles/site.css`.

One value is defined here rather than in the system. `--product-well` holds the
light `surface-sunken` value in both themes, because product photography is
shot on a bone ground and `object-fit: contain` leaves that ground visible
around the piece — a dark well would frame every photograph in the dark theme.

## The catalogue

`lib/products.ts` is the single source of truth for all 22 pieces: name, price,
Stripe price id, material, wood swatch, copy, images and category. The old site
kept this data in each page's markup, which had already drifted.

When the booking module takes over as the CMS, this module is what it replaces.
Keep the `Product` type stable and swap the body of `getProducts()`.

## Integrations

Both are unchanged from the previous site and both are overridable by
environment variable:

| What | Default | Env var |
| --- | --- | --- |
| Stripe checkout session | `https://mozart-backend.onrender.com/create-checkout-session` | `NEXT_PUBLIC_CHECKOUT_ENDPOINT` |
| Custom-order briefs | `https://www.formbackend.com/f/8a1738ba071ca12a` | `NEXT_PUBLIC_ORDER_ENDPOINT` |

The custom-order form posts into a hidden iframe, as it did before, so the file
upload works without a cross-origin request.

## Deploying to Vercel

The Vercel project (`norvo-designs-projects/mozartlaser`) is already connected
to this repository and builds every branch. The site is a standard Next.js app
and needs no special configuration.

`mozartlaser.com` is still served by GitHub Pages, so the Vercel project only
holds `mozartlaser.vercel.app` for now. Merging to `main` therefore changes
what `mozartlaser.vercel.app` serves, not the live site.

To finish the move:

1. Make the repository private in GitHub settings.
2. Turn off GitHub Pages (Settings → Pages → Source: None).
3. Add `mozartlaser.com` and `www.mozartlaser.com` to the Vercel project and
   update the DNS records Vercel shows. `CNAME` in the repository root is a
   GitHub Pages artifact and can be deleted once DNS has moved.

Every URL the old site published redirects permanently to its new route — see
`legacyRedirects` in `next.config.mjs`.

## Images

`sharp` is a dependency so image optimization is fast in production. Source
images are capped at 2000px on the long edge; anything larger is wasted bytes
at the sizes the site actually renders.

`next.config.mjs` serves WebP only. AVIF is not enabled: encoding it hung
indefinitely on at least one source image.
