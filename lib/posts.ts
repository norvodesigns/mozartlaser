// Journal posts, lifted verbatim from the previous site's blog page.
// Copy is Caleb's — only the markup around it has changed.

export type PostBlock =
  | { type: 'p'; html: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string };

export type Post = {
  slug: string;
  title: string;
  /** Title with the one italicised word the brand emphasises. */
  titleHtml: string;
  tag: string | null;
  date: string | null;
  subtitle: string;
  hero: { src: string; alt: string } | null;
  heroCaption: string | null;
  excerpt: string;
  blocks: PostBlock[];
};

export const posts: Post[] = [
  {
    "slug": "introducing-the-landmarks-of-aviation-coaster-series",
    "title": "Introducing the Landmarks of Aviation Coaster Series",
    "titleHtml": "Introducing the Landmarks of <em>Aviation</em> Coaster Series",
    "tag": "New Release",
    "date": "April 2026",
    "subtitle": "For the people who love aviation.",
    "hero": {
      "src": "/products/landmarks-of-aviation/front-view.png",
      "alt": "Landmarks of Aviation Coaster Series — laser engraved wood"
    },
    "heroCaption": "The Landmarks of Aviation Coaster Series — hand-engraved, sealed, and polished in California.",
    "excerpt": "Some people have a thing for planes. Not casual interest — a real thing. They know the difference between a 747 and a 777 by silhouette. I'm one of those people. Which is why I made these coasters — if you know someone…",
    "blocks": [
      {
        "type": "p",
        "html": "Some people have a thing for planes. Not casual interest — a real thing. They know the difference between a 747 and a 777 by silhouette. I'm one of those people. Which is why I made these coasters — if you know someone like that, or if you are someone like that, this series was built for you by a fellow aviation enthusiast."
      },
      {
        "type": "p",
        "html": "The Landmarks of Aviation Coaster Series is a set of hand-engraved wooden coasters, each featuring a legendary aircraft burned into the surface with the same precision we bring to every piece we make. These aren't decorative placeholders — they're conversation starters, collector pieces, and the kind of thing that earns a permanent spot on a desk or shelf because it actually means something to the person who owns it."
      },
      {
        "type": "quote",
        "text": "Built for the person who can identify an aircraft by silhouette at 30,000 feet."
      },
      {
        "type": "p",
        "html": "<strong>Who These Are For:</strong> Pilots and student pilots. Aviation enthusiasts and history buffs. The dad who built model planes as a kid. The coworker who has a tiny aircraft on their desk. The graduate who just got their private certificate."
      },
      {
        "type": "video",
        "src": "/media/coaster-release.mp4"
      },
      {
        "type": "p",
        "html": "<strong>How They're Made:</strong> Every coaster in the series starts with reference photos of the actual aircraft. We pull the best angles — usually a clean profile or head-on — and trace them by hand in Adobe Illustrator, stripping away anything the laser can't render at coaster scale."
      },
      {
        "type": "p",
        "html": "Once the vector files are precise, we dial in the laser settings. Every aircraft design has different density — some have large open areas, others have tight mechanical detail — so power and speed are tuned individually per design, not copied from a template."
      },
      {
        "type": "p",
        "html": "From there, the coasters are sanded smooth before engraving. After engraving, they're sanded again to knock back any char and bring out the grain. Then sealed to lock in the engraving and protect the wood. Then hand-polished to give the finished piece a smooth, solid feel that holds up to actual daily use."
      },
      {
        "type": "p",
        "html": "<strong>Built to Last, Built to Use:</strong> The sealing and polishing process means the engravings hold up over time, and the coasters are thick enough to actually protect a surface. They're meant to be used, not just displayed — though plenty of people display them anyway."
      }
    ]
  },
  {
    "slug": "how-the-dragon-coin-was-made",
    "title": "How the Dragon Coin Was Made",
    "titleHtml": "How the <em>Dragon Coin</em> Was Made",
    "tag": "New Release",
    "date": "April 2026",
    "subtitle": "A small piece, built with precision from start to finish.",
    "hero": null,
    "heroCaption": "The finished Dragon Coin — sealed and ready for your bookshelf.",
    "excerpt": "Most people only see the final product. But what makes something like this worth owning is the process behind…",
    "blocks": [
      {
        "type": "p",
        "html": "Most people only see the final product. But what makes something like this worth owning is the process behind it."
      },
      {
        "type": "p",
        "html": "It starts in Adobe Illustrator. The dragon design was carefully created to be as charming as possible — approachable, detailed, and perfectly sized for a wood coin at 2 inches wide."
      },
      {
        "type": "p",
        "html": "Once the design is ready, it moves into LightBurn. This is where everything gets dialed in — power, speed, and passes. It requires trial and error because every piece of wood and every design turns out differently."
      },
      {
        "type": "p",
        "html": "After that, the coin is cut directly out of a solid plank of wood using the laser. This makes the edges very smooth and soft to hold — much softer than power tools could ever cut."
      },
      {
        "type": "p",
        "html": "The coin is then sanded to smooth the surface and remove char marks from the cutting. This step makes sure the final burn comes out clean and consistent. Next comes the engraving — transforming a flat piece of wood into a charming three-dimensional design. Once complete, it's sanded again and sealed."
      },
      {
        "type": "image",
        "src": "/products/dragon-coin/front-view.png",
        "alt": "Book Dragon laser engraved wood coin — finished product"
      },
      {
        "type": "p",
        "html": "This little coin is made to sit on your desk, your shelf, or alongside your books to remind you to read them!"
      }
    ]
  },
  {
    "slug": "how-to-give-a-gift-that-actually-means-something",
    "title": "How to Give a Gift That Actually Means Something",
    "titleHtml": "How to Give a Gift That Actually <em>Means Something</em>",
    "tag": "Tips &amp; Ideas",
    "date": "April 2026",
    "subtitle": "Most gifts don't last.",
    "hero": {
      "src": "/products/big-ben-plaque/front-view.png",
      "alt": "Big Ben laser engraved wood plaque — front view"
    },
    "heroCaption": null,
    "excerpt": "Not physically — they last. But mentally, they don't stick. A lot of them end up sitting on a shelf, getting used for a week, or just blending in with everything…",
    "blocks": [
      {
        "type": "p",
        "html": "Not physically — they last. But mentally, they don't stick. A lot of them end up sitting on a shelf, getting used for a week, or just blending in with everything else."
      },
      {
        "type": "quote",
        "text": "You want them to look at it and remember why they got it. You want it to feel intentional."
      },
      {
        "type": "p",
        "html": "<strong>Why People Actually Keep These:</strong> People hold onto things that feel personal. Not complicated — just personal. A place they recognize. A verse that means something. A design that feels familiar. That's what makes someone keep something long-term instead of tossing it aside. That's the whole idea behind Mozart Laser. Clean designs, real materials, no shortcuts."
      },
      {
        "type": "image",
        "src": "/products/big-ben-plaque/display.jpg",
        "alt": "Big Ben laser engraved wood plaque — display shot"
      },
      {
        "type": "p",
        "html": "<strong>The Big Ben Plaque:</strong> The newest piece is the Big Ben plaque, engraved into poplar wood. The detail of the tower comes through clean, and the natural grain of the wood gives it just enough variation to make each one feel slightly different. It doesn't look mass-produced, because it's not."
      },
      {
        "type": "p",
        "html": "<strong>It works well if you want something:</strong><br> • Classic without being boring<br> • Meaningful without needing customization<br> • Easy to gift without overthinking it"
      },
      {
        "type": "p",
        "html": "<strong>It's Also Discounted Right Now!</strong> Since it's a new release, it's currently priced lower than it normally will be."
      }
    ]
  },
  {
    "slug": "how-we-made-the-golden-gate-bridge-plaque",
    "title": "How We Made the Golden Gate Bridge Plaque",
    "titleHtml": "How We Made the <em>Golden Gate</em> Bridge Plaque",
    "tag": "Behind the Scenes",
    "date": "March 2026",
    "subtitle": "From sketch to engraving — a full walkthrough of our design process.",
    "hero": {
      "src": "/products/golden-gate-bridge/front-view.png",
      "alt": "Golden Gate Bridge laser engraved wood plaque — hand finished in California"
    },
    "heroCaption": "The finished Golden Gate Bridge plaque — poplar wood, hand-finished in California.",
    "excerpt": "Every plaque starts with a problem: how do you capture something iconic in a few millimeters of burned wood? The Golden Gate Bridge took 3 iterations before we felt like we had it right. The towers needed weight. The…",
    "blocks": [
      {
        "type": "p",
        "html": "Every plaque starts with a problem: how do you capture something iconic in a few millimeters of burned wood? The Golden Gate Bridge took 3 iterations before we felt like we had it right. The towers needed weight. The cables needed to be visible. The water beneath had to read as water without becoming noise."
      },
      {
        "type": "p",
        "html": "We start every design in Adobe Illustrator, tracing from reference photos and simplifying down to what the laser can actually render cleanly at small scale. Fine detail looks great on screen and disappears on wood — so the art is really in knowing what to leave out."
      },
      {
        "type": "quote",
        "text": "The art is really in knowing what to leave out."
      },
      {
        "type": "p",
        "html": "Once the vector is dialed in, we run test burns on scrap pieces of the same wood stock. Every board has a slightly different grain density, which affects how dark the burn comes out. We adjust power and speed until the contrast feels right — not too burnt, not too faint."
      },
      {
        "type": "video",
        "src": "/media/golden-gate-highlight.mp4"
      },
      {
        "type": "p",
        "html": "The final step is hand-finishing — a light sand to knock back any char smell, then a protective sealing spray to help the engraving last and stay sharp. We only ship it to you when we feel it is good enough to display in our own home."
      }
    ]
  },
  {
    "slug": "wood-types-we-use-and-why",
    "title": "Wood Types We Use and Why",
    "titleHtml": "Wood Types We Use <em>and Why</em>",
    "tag": "Process",
    "date": "February 2026",
    "subtitle": "Not all wood engraves the same. Here's how we choose.",
    "hero": {
      "src": "/media/wood.jpg",
      "alt": "Pine wood grain — laser engraving material"
    },
    "heroCaption": null,
    "excerpt": "One of the first questions we get from custom order customers is: \"What kind of wood is it?\" The honest answer is that it depends — on the design, the use case, and what kind of look we're going…",
    "blocks": [
      {
        "type": "p",
        "html": "One of the first questions we get from custom order customers is: \"What kind of wood is it?\" The honest answer is that it depends — on the design, the use case, and what kind of look we're going for."
      },
      {
        "type": "p",
        "html": "<strong>Pine Wood</strong> is our go-to for detailed work. It's rich, close-grained, and produces a high-contrast burn that makes fine lines and small text pop cleanly. It's forgiving with the laser and consistent across boards."
      },
      {
        "type": "p",
        "html": "<strong>Poplar</strong> is for pieces that need presence. The light, soft grain means the engraving reads differently — images engrave very well on it because of its ability to show many different shades, from dark burns to light texture."
      },
      {
        "type": "image",
        "src": "/products/ship/side-view.jpg",
        "alt": "Ship engraving side view — acacia wood detail"
      },
      {
        "type": "p",
        "html": "When you place a custom order, just let us know if you have a preference — or describe what you're going for and we'll make the call. We keep multiple species in stock and can usually match the right wood to the right project."
      }
    ]
  },
  {
    "slug": "why-we-started-mozart-laser",
    "title": "Why We Started Mozart Laser",
    "titleHtml": "Why We Started <em>Mozart Laser</em>",
    "tag": "Our Story",
    "date": "January 2026",
    "subtitle": "Built to be kept, not forgotten.",
    "hero": {
      "src": "/media/workshop.jpeg",
      "alt": "Mozart Laser workshop — California laser engraving studio"
    },
    "heroCaption": null,
    "excerpt": "Mozart Laser started with a simple frustration — most gifts feel temporary. They're used for a while, then forgotten. We wanted to make something different. Using real wood and precise engraving, each piece is designed…",
    "blocks": [
      {
        "type": "p",
        "html": "Mozart Laser started with a simple frustration — most gifts feel temporary. They're used for a while, then forgotten. We wanted to make something different. Using real wood and precise engraving, each piece is designed to feel intentional from the start."
      },
      {
        "type": "quote",
        "text": "Great craft should feel like music. Precise, intentional, and worth sitting with."
      },
      {
        "type": "p",
        "html": "The name came from a simple idea: great craft should feel like music. Precise, intentional, and worth sitting with. Mozart wrote pieces that were technically demanding and emotionally immediate at the same time. That's what we want every engraving to be."
      },
      {
        "type": "p",
        "html": "Every order is handled by hand, refined through testing, and finished carefully so it doesn't just look good for a moment — it becomes something people hold onto."
      },
      {
        "type": "video",
        "src": "/media/blog-video-2.mp4"
      }
    ]
  }
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
