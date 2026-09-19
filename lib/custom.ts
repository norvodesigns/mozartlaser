// Pricing for the made-to-order flow, carried over from the old create.js.
// Personalising a catalogue piece costs more than the catalogue price — that
// surcharge is the studio's rule, not a derivation, so it lives here as data.

export type BlankForm = {
  /** Value submitted to the order backend — kept as the old form sent it. */
  id: string;
  /** What the customer sees, with its finished size. */
  name: string;
  price: number;
  image: string;
};

/** Blank stock for a piece designed from scratch. */
export const blankForms: BlankForm[] = [
  {
    id: 'Wooden Plaque (Horizontal)',
    name: 'Custom Horizontal Plaque (10" × 8")',
    price: 22.99,
    image: '/products/blank-samples/horizontal.png',
  },
  {
    id: 'Wooden Plaque (Vertical)',
    name: 'Custom Vertical Plaque (8" × 10")',
    price: 19.99,
    image: '/products/blank-samples/vertical.png',
  },
  {
    id: 'Custom Bookmark',
    name: 'Custom Bookmark (6" × 2")',
    price: 10.99,
    image: '/products/blank-samples/bookmark.png',
  },
  {
    id: 'Wooden Coaster',
    name: 'Custom Coaster (4" × 4")',
    price: 6.99,
    image: '/products/blank-samples/coaster.png',
  },
  {
    id: 'Custom Slate Coaster',
    name: 'Custom Slate Coaster (4" × 4")',
    price: 12.99,
    image: '/products/blank-samples/1slatedesign.png',
  },
  {
    id: 'Custom Wooden Coin',
    name: 'Custom Wooden Coin (2" × 2")',
    price: 6.99,
    image: '/products/blank-samples/coin.jpg',
  },
  {
    id: 'Custom Leather Wallet',
    name: 'Custom Leather Wallet',
    price: 22.99,
    image: '/products/blank-samples/wallet.jpg',
  },
];

/**
 * Price to personalise a catalogue piece, by product slug. A piece not listed
 * here falls back to PERSONALIZE_FALLBACK, as the old flow did.
 */
export const personalizePrices: Record<string, number> = {
  dove: 19.99,
  'rose-on-cross': 15.99,
  train: 18.99,
  ship: 79.99,
  'golden-gate-bridge': 21.99,
  'animal-plaque': 24.99,
  catalina: 19.99,
  'big-ben-plaque': 20.99,
  'adventurers-bookmark': 10.99,
  'leaf-bookmark': 15.99,
  'historia-bookmark': 12.99,
  'celtic-cross': 72.99,
  'tolkien-bookmark': 10.99,
  'landmarks-of-aviation': 19.99,
  'dragon-coin': 8.99,
  'jane-austen-bookmark': 10.99,
  'wanderer-bookmark': 10.99,
};

export const PERSONALIZE_FALLBACK = 20;

/** 20 or more of one design from scratch takes 10% off. */
export const BULK_THRESHOLD = 20;
export const BULK_DISCOUNT = 0.1;

export const FONTS = [
  'Arial',
  'Apple Chancery',
  'Academy Engraved LET',
  'American Typewriter',
  'Apple Symbols',
  'Charmonman',
  'Times New Roman',
  'Source Code Pro',
];

export const FONT_SIZES = ['Small', 'Medium', 'Large'];

/** Where the custom order is delivered. Unchanged from the old form. */
export const ORDER_ENDPOINT =
  process.env.NEXT_PUBLIC_ORDER_ENDPOINT ??
  'https://www.formbackend.com/f/8a1738ba071ca12a';

export function unitPrice(base: number, quantity: number, fromScratch: boolean): number {
  if (fromScratch && quantity >= BULK_THRESHOLD) {
    return base * (1 - BULK_DISCOUNT);
  }
  return base;
}
