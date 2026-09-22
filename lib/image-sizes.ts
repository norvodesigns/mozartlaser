// Intrinsic pixel sizes, read off the files at build-prep time.
// Passing real dimensions to next/image keeps the reserved box the right
// shape, which is what holds CLS down and stops tall pieces being
// letterboxed inside a square placeholder.

export const IMAGE_SIZES: Record<string, { w: number; h: number }> = {
  "/products/adventurers-bookmark/front-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/adventurers-bookmark/display.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/adventurers-bookmark/held-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/catalina/front-view.png": {
    "w": 976,
    "h": 793
  },
  "/products/catalina/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/catalina/display.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/big-ben-plaque/front-view.png": {
    "w": 765,
    "h": 965
  },
  "/products/big-ben-plaque/side-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/big-ben-plaque/display.jpg": {
    "w": 1500,
    "h": 2000
  },
  "/products/dragon-coin/front-view.png": {
    "w": 567,
    "h": 770
  },
  "/products/dragon-coin/back-view.png": {
    "w": 334,
    "h": 600
  },
  "/products/dragon-coin/display.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/celtic-cross/front-view.png": {
    "w": 802,
    "h": 1070
  },
  "/products/celtic-cross/side-view.png": {
    "w": 851,
    "h": 1512
  },
  "/products/rose-on-cross/front-view.png": {
    "w": 493,
    "h": 658
  },
  "/products/rose-on-cross/side-view.jpg": {
    "w": 2000,
    "h": 1500
  },
  "/products/rose-on-cross/display.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/animal-plaque/front-view.png": {
    "w": 1081,
    "h": 1867
  },
  "/products/animal-plaque/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/animal-plaque/display.jpg": {
    "w": 2000,
    "h": 1533
  },
  "/products/blank-samples/coaster.png": {
    "w": 1500,
    "h": 2000
  },
  "/products/blank-samples/1slatedesign.png": {
    "w": 421,
    "h": 456
  },
  "/products/train/front-view.png": {
    "w": 917,
    "h": 786
  },
  "/products/train/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/train/back-view.jpg": {
    "w": 1114,
    "h": 2000
  },
  "/products/train/display.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/golden-gate-bridge/front-view.png": {
    "w": 791,
    "h": 628
  },
  "/products/golden-gate-bridge/side-view.png": {
    "w": 1008,
    "h": 567
  },
  "/products/golden-gate-bridge/display.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/historia-bookmark/front-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/historia-bookmark/book-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/historia-bookmark/held-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/jane-austen-bookmark/front-view.png": {
    "w": 278,
    "h": 493
  },
  "/products/jane-austen-bookmark/book-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/landmarks-of-aviation/front-view.png": {
    "w": 1428,
    "h": 804
  },
  "/products/landmarks-of-aviation/back-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/landmarks-of-aviation/display.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/leaf-bookmark/front-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/leaf-bookmark/book-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/leaf-bookmark/held-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/literary-bookmarks-2-pack/front-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/literary-bookmarks-2-pack/book-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/literary-bookmarks-2-pack/held.png": {
    "w": 567,
    "h": 1008
  },
  "/products/moon/front-view.png": {
    "w": 545,
    "h": 698
  },
  "/products/moon/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/moon/display.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/np-coasters/front-view.png": {
    "w": 2000,
    "h": 1125
  },
  "/products/np-coasters/side-view.png": {
    "w": 1428,
    "h": 804
  },
  "/products/np-coasters/back-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/stone-steel-and-sky/front-view.png": {
    "w": 984,
    "h": 1229
  },
  "/products/stone-steel-and-sky/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/tolkien-bookmark/front-view.png": {
    "w": 283,
    "h": 502
  },
  "/products/tolkien-bookmark/book-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/wanderer-bookmark/front-view.png": {
    "w": 567,
    "h": 1008
  },
  "/products/wanderer-bookmark/book-view.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/wanderer-bookmark/held-view.png": {
    "w": 1125,
    "h": 2000
  },
  "/products/ship/front-view.png": {
    "w": 748,
    "h": 1059
  },
  "/products/ship/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/ship/display.jpg": {
    "w": 1656,
    "h": 2000
  },
  "/products/dove/front-view.png": {
    "w": 526,
    "h": 671
  },
  "/products/dove/side-view.jpg": {
    "w": 2000,
    "h": 1125
  },
  "/products/dove/display.jpg": {
    "w": 1125,
    "h": 2000
  },
  "/products/blank-samples/horizontal.png": {
    "w": 2000,
    "h": 1500
  },
  "/products/blank-samples/vertical.png": {
    "w": 1500,
    "h": 2000
  },
  "/products/blank-samples/bookmark.png": {
    "w": 1428,
    "h": 2000
  },
  "/products/blank-samples/coin.jpg": {
    "w": 1114,
    "h": 2000
  },
  "/products/blank-samples/wallet.jpg": {
    "w": 2000,
    "h": 1526
  },
  "/media/wood.jpg": {
    "w": 1300,
    "h": 731
  },
  "/media/workshop.jpeg": {
    "w": 2000,
    "h": 1110
  }
};

const FALLBACK = { w: 1000, h: 1000 };

export function imageSize(src: string): { w: number; h: number } {
  return IMAGE_SIZES[src] ?? FALLBACK;
}
