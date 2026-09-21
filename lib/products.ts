// The booking module's manager portal is the CMS: a business adds a product
// there and it appears here through the public catalogue API. This module
// fetches that API and falls back to the hand-checked static list below when
// the API is unreachable or returns nothing, so the storefront never goes
// blank because of a network hiccup or an empty catalogue.

import { imageSize } from './image-sizes';

export type Wood = 'acacia' | 'poplar' | 'pine';

/** A single gallery image with the real dimensions Next/Image needs. */
export type ProductImage = {
  src: string;
  width: number;
  height: number;
};

export type Product = {
  /** URL segment: /products/<slug> */
  slug: string;
  name: string;
  category: string;
  price: number;
  /** Struck-through original price, where the piece is on sale. */
  compareAtPrice: number | null;
  /** Stripe Price id. Null means the piece is quoted through /create. */
  stripePriceId: string | null;
  /** Line-item name sent to Stripe — kept as the old site sent it. */
  checkoutName: string;
  /** Swatch colour. Null where the real wood is outside the system's three. */
  wood: Wood | null;
  /** Material line: material · dimension · finish */
  material: string;
  description: string;
  bullets: string[];
  /** Ordered front → side → back → in-use → display. First is the hero shot. */
  images: ProductImage[];
  /** Made to order through the custom flow rather than added to the cart. */
  custom: boolean;
};

type StaticProduct = Omit<Product, 'images'> & { images: string[] };

const staticCatalogue: StaticProduct[] = [
  {
    "slug": "adventurers-bookmark",
    "name": "Adventurer's Bookmark",
    "category": "Bookmarks",
    "price": 7.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TQGXs2c5eOyE1cRh5Xkv0Lm",
    "checkoutName": "Adventurer's Bookmark",
    "wood": "poplar",
    "material": "poplar · 0.15\" thick · 6\" x 1.25\"",
    "description": "Mountain contours and compass design laser-cut from premium poplar. The kind of bookmark you don't lose because you actually want to keep it. Rich dark grain makes the engraving pop beautifully.",
    "bullets": [
      "Premium poplar — rich dark grain",
      "Mountain contours and compass design",
      "Perfect gift for readers and adventurers"
    ],
    "images": [
      "/products/adventurers-bookmark/front-view.png",
      "/products/adventurers-bookmark/display.jpg",
      "/products/adventurers-bookmark/held-view.png"
    ],
    "custom": false
  },
  {
    "slug": "catalina",
    "name": "Avalon Bay, Catalina Island Plaque",
    "category": "Plaques",
    "price": 16.99,
    "compareAtPrice": 25.99,
    "stripePriceId": "price_1TKKkt2c5eOyE1cRYIXmum51",
    "checkoutName": "Avalon Bay, Catalina Island Laser Engraved Plaque",
    "wood": "poplar",
    "material": "poplar wood · Hand-finished · Wall-ready",
    "description": "The tranquil beauty of Catalina Island's Avalon Bay, captured in natural poplar wood. Rolling hills, the iconic waterside pavilion, swaying palms — every detail of this coastal scene engraved with precision and care. A natural gift for anyone with a connection to California's coast.",
    "bullets": [
      "Avalon Bay scene — pavilion, palms, and rolling hills",
      "Natural poplar grain visible through the engraving",
      "Hand-finished in California — wall-ready"
    ],
    "images": [
      "/products/catalina/front-view.png",
      "/products/catalina/side-view.jpg",
      "/products/catalina/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "big-ben-plaque",
    "name": "Big Ben Plaque",
    "category": "Plaques",
    "price": 16.99,
    "compareAtPrice": 19.99,
    "stripePriceId": "price_1TKJvp2c5eOyE1cRUD7Y4VLf",
    "checkoutName": "Big Ben Plaque",
    "wood": "poplar",
    "material": "Poplar wood · Hand-finished · ~8x10 in",
    "description": "A detailed engraving of Big Ben into poplar wood. The natural grain gives each piece enough variation to feel unique — it doesn't look mass-produced, because it's not. Classic without being boring.",
    "bullets": [
      "Detailed Big Ben — every tier rendered",
      "Natural poplar grain makes each piece unique",
      "Classic, timeless gift — no explanation needed"
    ],
    "images": [
      "/products/big-ben-plaque/front-view.png",
      "/products/big-ben-plaque/side-view.jpg",
      "/products/big-ben-plaque/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "dragon-coin",
    "name": "Book Dragon Coin",
    "category": "Coins",
    "price": 5.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TKkrY2c5eOyE1cRTlnQi4rd",
    "checkoutName": "Dragon Coin",
    "wood": "poplar",
    "material": "Poplar Wood · 2\" diameter · Double-sided",
    "description": "Laser-engraved onto natural Poplar Wood with an adorable dragon on front and Book Dragon on the reverse. Laser-cut edges are impossibly smooth. Sealed and hand-finished.",
    "bullets": [
      "Dragon engraving front — Book Dragon reverse",
      "Laser-cut edges — buttery smooth finish",
      "For bookish people, desks, and shelves"
    ],
    "images": [
      "/products/dragon-coin/front-view.png",
      "/products/dragon-coin/back-view.png",
      "/products/dragon-coin/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "celtic-cross",
    "name": "Celtic Cross Cutting Board",
    "category": "Cutting boards",
    "price": 64.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TPQEU2c5eOyE1cRhwNYZFyI",
    "checkoutName": "Laser Engraved Celtic Cross Wooden Cutting Board",
    "wood": null,
    "material": "Hardwood · Food-safe · ~12x9 in",
    "description": "A detailed Celtic cross laser-engraved across a full hardwood cutting board. Intricate knotwork engraved with precision — equally at home as a kitchen workhorse or a striking display piece.",
    "bullets": [
      "Full-surface Celtic knotwork — precisely engraved",
      "Food-safe hardwood — works as a real cutting board",
      "Striking as wall decor or shelf display"
    ],
    "images": [
      "/products/celtic-cross/front-view.png",
      "/products/celtic-cross/side-view.png",
      "/products/celtic-cross/display.mp4"
    ],
    "custom": false
  },
  {
    "slug": "rose-on-cross",
    "name": "Cross Design with John 14:27",
    "category": "Plaques",
    "price": 15,
    "compareAtPrice": null,
    "stripePriceId": "price_1TKKo12c5eOyE1cR2IiNu2p3",
    "checkoutName": "Cross Design with John 14:27",
    "wood": "pine",
    "material": "Pine wood · Hand-finished · Wall-ready",
    "description": "A beautiful ornate wooden cross with a rose wrapping around it and John 14:27 engraved beneath. Precision-cut and laser engraved on premium pine for a timeless display — the kind of piece that carries meaning every time you see it.",
    "bullets": [
      "Ornate cross with rose design and John 14:27",
      "Precision laser engraving on natural pine wood",
      "Hand-finished in California — wall-ready"
    ],
    "images": [
      "/products/rose-on-cross/front-view.png",
      "/products/rose-on-cross/side-view.jpg",
      "/products/rose-on-cross/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "animal-plaque",
    "name": "Custom Animal Plaque",
    "category": "Plaques",
    "price": 24.99,
    "compareAtPrice": null,
    "stripePriceId": null,
    "checkoutName": "Custom Animal Plaque",
    "wood": "pine",
    "material": "Pine wood · Hand-finished · Custom engraved",
    "description": "Upload a photo of your pet and have it custom engraved on natural pine wood. Use a clear, distinct picture with your pet against a plain background for best results. Want your pet's name underneath or any other additions? Describe your design in the \"Requested Changes\" box when customizing.",
    "bullets": [
      "Your pet's photo engraved with precision on pine wood",
      "Add a name, date, or custom text — just describe it",
      "Hand-finished in California — a truly one-of-a-kind piece"
    ],
    "images": [
      "/products/animal-plaque/front-view.png",
      "/products/animal-plaque/side-view.jpg",
      "/products/animal-plaque/display.jpg"
    ],
    "custom": true
  },
  {
    "slug": "custom-coaster",
    "name": "Custom Wood Coaster",
    "category": "Coasters",
    "price": 6.99,
    "compareAtPrice": null,
    "stripePriceId": null,
    "checkoutName": "Custom Wood Coaster",
    "wood": "pine",
    "material": "Pine wood · 4\" x 4\" · Fully custom",
    "description": "A fully customizable wooden coaster — bring your own logo, artwork, text, or design idea and we'll laser engrave it with precision. Made from durable pine wood, sealed for protection, and ready for daily use. Ideal for home décor, business branding, or personalized gifts.",
    "bullets": [
      "Fully custom — your logo, text, or artwork",
      "Durable pine wood with protective seal",
      "Great for home use, branding, or gifts"
    ],
    "images": [
      "/products/blank-samples/coaster.png",
      "/products/blank-samples/1slatedesign.png"
    ],
    "custom": true
  },
  {
    "slug": "train",
    "name": "Detailed Classic Train Engraving",
    "category": "Plaques",
    "price": 10.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TT7OK2c5eOyE1cRDJAl5UVE",
    "checkoutName": "Train Plaque",
    "wood": "poplar",
    "material": "Poplar wood · Hand-finished · ~8x10 in",
    "description": "This engraved train plaque has a quiet kind of presence. The locomotive is drawn with incredible precision — every bolt, pipe, and curve rendered clearly without feeling cluttered. The natural wood grain shows through the engraving just enough to give it warmth. Each plaque ends up a little different because of that.",
    "bullets": [
      "Highly precise locomotive — every bolt and pipe visible",
      "Natural poplar grain adds warmth to every piece",
      "Ideal for offices, workshops, or rooms with a rustic feel"
    ],
    "images": [
      "/products/train/front-view.png",
      "/products/train/side-view.jpg",
      "/products/train/back-view.jpg",
      "/products/train/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "golden-gate-bridge",
    "name": "Golden Gate Bridge Plaque",
    "category": "Plaques",
    "price": 16.99,
    "compareAtPrice": 25.99,
    "stripePriceId": "price_1TKKjC2c5eOyE1cRO43oSuLL",
    "checkoutName": "Golden Gate Bridge Plaque",
    "wood": "poplar",
    "material": "Poplar wood · Hand-finished · Wall-ready",
    "description": "A detailed engraving of the Golden Gate Bridge rendered in natural poplar wood. The cables, towers, and surrounding landscape are captured with sharp precision — the kind of piece that looks equally at home in an office or a living room. Each plaque is hand-finished in California.",
    "bullets": [
      "Detailed cable and tower engraving — sharp and precise",
      "Natural poplar grain visible through the engraving",
      "Hand-finished in California — wall-ready"
    ],
    "images": [
      "/products/golden-gate-bridge/front-view.png",
      "/products/golden-gate-bridge/side-view.png",
      "/products/golden-gate-bridge/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "historia-bookmark",
    "name": "Historia Bookmark",
    "category": "Bookmarks",
    "price": 9.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TT9im2c5eOyE1cR1NzaVYJ2",
    "checkoutName": "Historia Bookmark",
    "wood": "poplar",
    "material": "poplar · 0.15\" thick · 6\" x 1.25\"",
    "description": "Laser-engraved on rich poplar, the Historia Bookmark maps the ancient Mediterranean in stunning detail — sailing ships, the Library of Alexandria, key classical cities, and the Greek word Ιστορία at the top. A subtle timeline runs along the bottom so you're literally holding centuries of history in your hand while you read. The engraving has real depth, the wood feels solid and warm, and a blue tassel gives it a finished, premium touch.",
    "bullets": [
      "Detailed vintage Mediterranean map with historical landmarks",
      "Rich poplar grain with deep, precise engraving",
      "Perfect gift for history lovers, readers, and students"
    ],
    "images": [
      "/products/historia-bookmark/front-view.png",
      "/products/historia-bookmark/book-view.jpg",
      "/products/historia-bookmark/held-view.png"
    ],
    "custom": false
  },
  {
    "slug": "jane-austen-bookmark",
    "name": "Jane Austen Quote Bookmark",
    "category": "Bookmarks",
    "price": 7.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TKKc62c5eOyE1cRqVahvXUw",
    "checkoutName": "Jane Austen Quote Bookmark",
    "wood": "poplar",
    "material": "poplar · 0.15\" thick · 6\" x 1.25\"",
    "description": "A bookmark laser-engraved on rich poplar featuring a quote from Jane Austen, paired with elegant illustration work that suits the source material. Finished with a wood stain and sealant. The kind of thing a reader keeps.",
    "bullets": [
      "Jane Austen quote with elegant engraved illustration",
      "Rich poplar with wood stain and sealant finish",
      "Perfect gift for readers and Austen fans"
    ],
    "images": [
      "/products/jane-austen-bookmark/front-view.png",
      "/products/jane-austen-bookmark/book-view.jpg"
    ],
    "custom": false
  },
  {
    "slug": "landmarks-of-aviation",
    "name": "Landmarks of Aviation — Coaster Set",
    "category": "Coasters",
    "price": 15,
    "compareAtPrice": null,
    "stripePriceId": "price_1TLbIz2c5eOyE1cRgptBrHol",
    "checkoutName": "Landmarks of Aviation - Coaster set",
    "wood": "pine",
    "material": "Pine Wood · Protective seal finish · Set of 3",
    "description": "The story of aviation, right on your desk. Three of the most iconic aircraft ever built — the Wright Flyer, where it all began; the Boeing 747-400, which made global travel possible at scale; and the Concorde, the peak of speed and engineering. Each coaster is laser engraved into real wood with a clean, timeless style, then sealed with a protective finish that holds up through daily use. Not just a coaster set — a small tribute to progress.",
    "bullets": [
      "Wright Flyer, Boeing 747-400, and Concorde — all three legends",
      "Real wood with natural grain — each piece slightly unique",
      "Protective seal resists water damage and daily wear"
    ],
    "images": [
      "/products/landmarks-of-aviation/front-view.png",
      "/products/landmarks-of-aviation/back-view.png",
      "/products/landmarks-of-aviation/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "leaf-bookmark",
    "name": "Leaf Bookmark",
    "category": "Bookmarks",
    "price": 12.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TTADF2c5eOyE1cR9MQmiZPs",
    "checkoutName": "Leaf Bookmark",
    "wood": "poplar",
    "material": "poplar · 0.15\" thick · 6\" x 1.25\"",
    "description": "A bold layered leaf design engraved into rich poplar wood. The contrast between the dark poplar and the precise laser engraving creates real depth. The kind of object that makes reading feel more intentional.",
    "bullets": [
      "Bold layered leaf — precise depth engraving",
      "Premium poplar with natural dark grain",
      "Thoughtful gift for any book lover"
    ],
    "images": [
      "/products/leaf-bookmark/front-view.png",
      "/products/leaf-bookmark/book-view.jpg",
      "/products/leaf-bookmark/held-view.png"
    ],
    "custom": false
  },
  {
    "slug": "literary-bookmarks-2-pack",
    "name": "Literary Quote Bookmark Pack",
    "category": "Bookmarks",
    "price": 12,
    "compareAtPrice": null,
    "stripePriceId": "price_1TKKdX2c5eOyE1cRaxRKklq9",
    "checkoutName": "Literary Quote Bookmark Pack",
    "wood": "poplar",
    "material": "poplar · Pack of 2 · Stain & sealant finish",
    "description": "Two bookmarks, one price. A Tolkien quote paired with a quill pen design, and a Jane Austen quote with elegant illustration work — both laser-engraved on rich poplar with a wood stain and sealant finish. A natural gift for any reader.",
    "bullets": [
      "Tolkien quill pen design + Jane Austen literary illustration",
      "Rich poplar with wood stain and sealant finish",
      "Better value than buying each bookmark separately"
    ],
    "images": [
      "/products/literary-bookmarks-2-pack/front-view.png",
      "/products/literary-bookmarks-2-pack/book-view.jpg",
      "/products/literary-bookmarks-2-pack/held.png"
    ],
    "custom": false
  },
  {
    "slug": "moon",
    "name": "Lunar Surface Moon Plaque",
    "category": "Plaques",
    "price": 19.99,
    "compareAtPrice": 29.99,
    "stripePriceId": "price_1TKKhB2c5eOyE1cRco2C90pL",
    "checkoutName": "Moon Relief Plaque – Laser-Engraved Lunar Surface in Solid Wood",
    "wood": "poplar",
    "material": "Poplar wood · Hand-finished · Relief engraved",
    "description": "A textured lunar surface relief engraved into natural poplar wood, highlighting the craters, ridges, and quiet detail of the moon. Each piece is individually made and hand-finished — the depth of the engraving shifts with the light, giving it a presence that's hard to put down.",
    "bullets": [
      "Textured lunar surface with real engraved depth",
      "Natural poplar — grain visible through the engraving",
      "Hand-finished in California"
    ],
    "images": [
      "/products/moon/front-view.png",
      "/products/moon/side-view.jpg",
      "/products/moon/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "np-coasters",
    "name": "National Parks Coaster Set",
    "category": "Coasters",
    "price": 24.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TSnhT2c5eOyE1cR86EYui75",
    "checkoutName": "National Parks Coaster Set",
    "wood": null,
    "material": "Hardwood · Food-safe sealed · 3.5\" diameter · Set of 4",
    "description": "Four premium wooden coasters featuring Yosemite, Yellowstone, Grand Canyon, and Zion — each engraved with precision and sealed for daily use. Conversation starters, collector pieces, the kind that earns a permanent spot on any coffee table.",
    "bullets": [
      "Set of 4 — Yosemite, Yellowstone, Grand Canyon, Zion",
      "Food-safe sealed finish — built for real daily use",
      "Perfect housewarming or nature-lover gift"
    ],
    "images": [
      "/products/np-coasters/front-view.png",
      "/products/np-coasters/side-view.png",
      "/products/np-coasters/back-view.png"
    ],
    "custom": false
  },
  {
    "slug": "stone-steel-and-sky",
    "name": "Stone, Steel, and Sky Triptych",
    "category": "Plaques",
    "price": 39.99,
    "compareAtPrice": 54.99,
    "stripePriceId": "price_1TKKIV2c5eOyE1cRkrylS6ES",
    "checkoutName": "Stone, Steel, and Sky - Triptych",
    "wood": "poplar",
    "material": "Poplar wood · Hand-finished · Set of 3 plaques",
    "description": "Three engraved plaques — the moon, the Golden Gate Bridge, and Big Ben — designed to be displayed as a gallery wall or given individually. Each hand-finished on poplar wood.",
    "bullets": [
      "Moon, Golden Gate, Big Ben — three iconic subjects",
      "Display together or give individually",
      "Significant saving vs. buying each separately"
    ],
    "images": [
      "/products/stone-steel-and-sky/front-view.png",
      "/products/stone-steel-and-sky/side-view.jpg"
    ],
    "custom": false
  },
  {
    "slug": "tolkien-bookmark",
    "name": "Tolkien Quote Bookmark",
    "category": "Bookmarks",
    "price": 7.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TKKaV2c5eOyE1cR667ao0wX",
    "checkoutName": "Tolkien Quote Bookmark",
    "wood": null,
    "material": "Walnut · 0.15\" thick · 6\" x 1.25\"",
    "description": "A bookmark engraved with a quote from J.R.R. Tolkien's <em>Lord of the Rings</em>, paired with a quill pen illuminated by the moon. Finished with a high-quality wood stain and sealant — the kind of bookmark that feels at home in a well-loved book.",
    "bullets": [
      "Tolkien quote with moonlit quill pen illustration",
      "High-quality wood stain and sealant finish",
      "Perfect for Tolkien fans and fantasy readers"
    ],
    "images": [
      "/products/tolkien-bookmark/front-view.png",
      "/products/tolkien-bookmark/book-view.jpg"
    ],
    "custom": false
  },
  {
    "slug": "wanderer-bookmark",
    "name": "Wanderer Bookmark",
    "category": "Bookmarks",
    "price": 7.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TfBUt2c5eOyE1cRFdXL8bzc",
    "checkoutName": "Wanderer Bookmark",
    "wood": "poplar",
    "material": "poplar · 0.15\" thick · 6\" x 1.25\"",
    "description": "Escape into your next adventure with the Wanderer Bookmark — a beautifully laser-engraved wooden bookmark inspired by mountains, exploration, and the timeless quote, “Not all those who wander are lost.” Crafted from premium wood with a rustic natural finish, it adds a calm, adventurous touch to every book you open.",
    "bullets": [
      "Precision laser-engraved mountain and moon artwork",
      "Inspirational “Not all those who wander are lost” quote",
      "Premium wood construction with rustic natural grain",
      "Lightweight, slim, and durable design",
      "Attached cord tassel for easy page finding",
      "Perfect gift for readers, travelers, and outdoor lovers"
    ],
    "images": [
      "/products/wanderer-bookmark/front-view.png",
      "/products/wanderer-bookmark/book-view.jpg",
      "/products/wanderer-bookmark/held-view.png"
    ],
    "custom": false
  },
  {
    "slug": "ship",
    "name": "Wooden Cutting Board with Ship",
    "category": "Cutting boards",
    "price": 59.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TOocs2c5eOyE1cRHBCgHnm4",
    "checkoutName": "Wooden Cutting Board with Ship",
    "wood": "acacia",
    "material": "Acacia wood · Food-safe finish · ~12x9 in",
    "description": "An ornate acacia wood cutting board with a highly detailed ship engraving. The natural variation in acacia — warm tones and flowing grain — makes this one of our most visually striking pieces.",
    "bullets": [
      "Full-surface ship engraving — highly detailed",
      "Premium acacia wood with rich natural grain",
      "Food-safe — works as cutting board or display"
    ],
    "images": [
      "/products/ship/front-view.png",
      "/products/ship/side-view.jpg",
      "/products/ship/display.jpg"
    ],
    "custom": false
  },
  {
    "slug": "dove",
    "name": "Wooden Dove Plaque — Psalm 46:5",
    "category": "Plaques",
    "price": 16.99,
    "compareAtPrice": null,
    "stripePriceId": "price_1TKKpc2c5eOyE1cRMrOEcEiT",
    "checkoutName": "Wooden Dove Plaque - Psalm 46:5",
    "wood": "pine",
    "material": "Pine wood · Hand-finished · Wall-ready",
    "description": "A graceful dove in flight with Psalm 46:5 engraved beneath — laser-cut and engraved on natural pine wood. A meaningful piece of Christian wall décor that works equally well as a gift or as something to keep. Hand-finished in California.",
    "bullets": [
      "Dove design with Psalm 46:5 engraved beneath",
      "Natural pine grain visible through the engraving",
      "Meaningful Christian gift — hand-finished in California"
    ],
    "images": [
      "/products/dove/front-view.png",
      "/products/dove/side-view.jpg",
      "/products/dove/display.jpg"
    ],
    "custom": false
  }
];

let resolvedStatic: Product[] | null = null;

/** The hand-checked list, with each image resolved to real dimensions. */
function getStaticProducts(): Product[] {
  if (!resolvedStatic) {
    resolvedStatic = staticCatalogue.map((product) => ({
      ...product,
      images: product.images.map((src) => {
        const size = imageSize(src);
        return { src, width: size.w, height: size.h };
      }),
    }));
  }
  return resolvedStatic;
}

/**
 * The public catalogue API the manager portal's Supabase data feeds. A
 * business slug other than mozartlaser can override this at deploy time.
 */
const CATALOGUE_API_URL =
  process.env.NEXT_PUBLIC_CATALOGUE_API_URL ??
  'https://dashboard.norvodesigns.com/api/public/v1/businesses/mozart-laser/products';

type RemoteImage = {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type RemoteProduct = {
  slug: string;
  name: string;
  category: string | null;
  description: string | null;
  bullets: string[];
  material: string | null;
  wood: Wood | null;
  price: number;
  compareAtPrice: number | null;
  personalizePrice: number | null;
  custom: boolean;
  stripePriceId: string | null;
  images: RemoteImage[];
};

function fromRemote(row: RemoteProduct): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category ?? 'Other',
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    stripePriceId: row.stripePriceId,
    // The public API doesn't carry a separate Stripe line-item name, so the
    // product name is what a checkout session shows.
    checkoutName: row.name,
    wood: row.wood,
    material: row.material ?? '',
    description: row.description ?? '',
    bullets: row.bullets ?? [],
    images: (row.images ?? []).map((image) => ({
      src: image.url,
      width: image.width ?? 1000,
      height: image.height ?? 1000,
    })),
    custom: row.custom,
  };
}

/**
 * Fetches the live catalogue. Returns null on any failure — a bad response,
 * a network error, or an empty catalogue — so the caller can fall back to
 * the static list rather than showing an empty shop.
 */
async function fetchRemoteProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(CATALOGUE_API_URL, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { products?: RemoteProduct[] };
    if (!Array.isArray(data.products) || data.products.length === 0) return null;
    return data.products.map(fromRemote);
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const remote = await fetchRemoteProducts();
  return remote ?? getStaticProducts();
}

export async function getCategories(): Promise<string[]> {
  const all = await getProducts();
  return ['All', ...Array.from(new Set(all.map((p) => p.category))).sort()];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) return [];
  const sameCategory = all.filter(
    (p) => p.slug !== slug && p.category === product.category,
  );
  const rest = all.filter(
    (p) => p.slug !== slug && p.category !== product.category,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** Media in the gallery may be a still or a short clip. */
export function isVideo(src: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(src);
}
