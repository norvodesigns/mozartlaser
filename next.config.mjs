/** @type {import('next').NextConfig} */

// The old site was a folder of .html files served by GitHub Pages. Those URLs
// are indexed and linked, so each one moves permanently to its new route.
const legacyRedirects = [
  {
    "source": "/index.html",
    "destination": "/",
    "permanent": true
  },
  {
    "source": "/products.html",
    "destination": "/products",
    "permanent": true
  },
  {
    "source": "/create.html",
    "destination": "/create",
    "permanent": true
  },
  {
    "source": "/About.html",
    "destination": "/about",
    "permanent": true
  },
  {
    "source": "/blog.html",
    "destination": "/blog",
    "permanent": true
  },
  {
    "source": "/success.html",
    "destination": "/order/success",
    "permanent": true
  },
  {
    "source": "/failiure.html",
    "destination": "/order/cancelled",
    "permanent": true
  },
  {
    "source": "/Animal Plaque.html",
    "destination": "/products/animal-plaque",
    "permanent": true
  },
  {
    "source": "/Animal%20Plaque.html",
    "destination": "/products/animal-plaque",
    "permanent": true
  },
  {
    "source": "/Big Ben Plaque.html",
    "destination": "/products/big-ben-plaque",
    "permanent": true
  },
  {
    "source": "/Big%20Ben%20Plaque.html",
    "destination": "/products/big-ben-plaque",
    "permanent": true
  },
  {
    "source": "/Catalina.html",
    "destination": "/products/catalina",
    "permanent": true
  },
  {
    "source": "/Dove.html",
    "destination": "/products/dove",
    "permanent": true
  },
  {
    "source": "/Golden Gate Bridge.html",
    "destination": "/products/golden-gate-bridge",
    "permanent": true
  },
  {
    "source": "/Golden%20Gate%20Bridge.html",
    "destination": "/products/golden-gate-bridge",
    "permanent": true
  },
  {
    "source": "/Jane Austen bookmark.html",
    "destination": "/products/jane-austen-bookmark",
    "permanent": true
  },
  {
    "source": "/Jane%20Austen%20bookmark.html",
    "destination": "/products/jane-austen-bookmark",
    "permanent": true
  },
  {
    "source": "/Literary Bookmarks 2 pack.html",
    "destination": "/products/literary-bookmarks-2-pack",
    "permanent": true
  },
  {
    "source": "/Literary%20Bookmarks%202%20pack.html",
    "destination": "/products/literary-bookmarks-2-pack",
    "permanent": true
  },
  {
    "source": "/Moon.html",
    "destination": "/products/moon",
    "permanent": true
  },
  {
    "source": "/Rose on Cross.html",
    "destination": "/products/rose-on-cross",
    "permanent": true
  },
  {
    "source": "/Rose%20on%20Cross.html",
    "destination": "/products/rose-on-cross",
    "permanent": true
  },
  {
    "source": "/Stone, Steel, and Sky.html",
    "destination": "/products/stone-steel-and-sky",
    "permanent": true
  },
  {
    "source": "/Stone%2C%20Steel%2C%20and%20Sky.html",
    "destination": "/products/stone-steel-and-sky",
    "permanent": true
  },
  {
    "source": "/Tolkien bookmark.html",
    "destination": "/products/tolkien-bookmark",
    "permanent": true
  },
  {
    "source": "/Tolkien%20bookmark.html",
    "destination": "/products/tolkien-bookmark",
    "permanent": true
  },
  {
    "source": "/adventurer's bookmark.html",
    "destination": "/products/adventurers-bookmark",
    "permanent": true
  },
  {
    "source": "/adventurer's%20bookmark.html",
    "destination": "/products/adventurers-bookmark",
    "permanent": true
  },
  {
    "source": "/celtic cross.html",
    "destination": "/products/celtic-cross",
    "permanent": true
  },
  {
    "source": "/celtic%20cross.html",
    "destination": "/products/celtic-cross",
    "permanent": true
  },
  {
    "source": "/custom coaster.html",
    "destination": "/products/custom-coaster",
    "permanent": true
  },
  {
    "source": "/custom%20coaster.html",
    "destination": "/products/custom-coaster",
    "permanent": true
  },
  {
    "source": "/dragon coin.html",
    "destination": "/products/dragon-coin",
    "permanent": true
  },
  {
    "source": "/dragon%20coin.html",
    "destination": "/products/dragon-coin",
    "permanent": true
  },
  {
    "source": "/historia_bookmark.html",
    "destination": "/products/historia-bookmark",
    "permanent": true
  },
  {
    "source": "/landmarks of aviation.html",
    "destination": "/products/landmarks-of-aviation",
    "permanent": true
  },
  {
    "source": "/landmarks%20of%20aviation.html",
    "destination": "/products/landmarks-of-aviation",
    "permanent": true
  },
  {
    "source": "/leaf_bookmark.html",
    "destination": "/products/leaf-bookmark",
    "permanent": true
  },
  {
    "source": "/np_coasters.html",
    "destination": "/products/np-coasters",
    "permanent": true
  },
  {
    "source": "/ship.html",
    "destination": "/products/ship",
    "permanent": true
  },
  {
    "source": "/train.html",
    "destination": "/products/train",
    "permanent": true
  },
  {
    "source": "/wanderer bookmark.html",
    "destination": "/products/wanderer-bookmark",
    "permanent": true
  },
  {
    "source": "/wanderer%20bookmark.html",
    "destination": "/products/wanderer-bookmark",
    "permanent": true
  }
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
    // Product photos uploaded through the booking module's manager portal
    // live in Supabase Storage rather than this repo's /public, so Next's
    // image optimizer needs the host allow-listed or it silently refuses to
    // load them.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rfophffgbaebgusfxykl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // The initial CMS seed points product_images.url at this site's own
        // /public files (absolute, not relative), since seeding had neither
        // a browser session nor a service-role key to upload to Storage
        // with. Next treats an absolute self-referential URL as remote too.
        protocol: 'https',
        hostname: 'mozartlaser.com',
        pathname: '/products/**',
      },
    ],
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
