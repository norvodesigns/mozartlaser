/**
 * Entrance and scroll choreography.
 *
 * This runs as an inline script in <head>, not as a React effect, because the
 * two ways it went wrong before were both about timing React can't control:
 *
 *  - Armed at hydration, it hid content that had already been on screen for a
 *    second or more on a slow phone, then played it back in. Armed here, the
 *    hidden state is in place before the first frame is painted.
 *  - A CSS animation starts its clock at style resolution. On a throttled
 *    phone the main thread is busy long enough that the hero finished before
 *    anyone saw a frame of it, and the product rose as an empty box because
 *    its photograph hadn't arrived. Here the entrance waits for the fonts and
 *    for a painted frame, and anything carrying a photograph waits for that
 *    photograph to decode — each capped, so a slow asset never holds the page.
 *
 * Markup opts in with `data-reveal` (see `reveal()` in lib/reveal.ts); the CSS under
 * REVEAL in styles/site.css owns every visual. A batch is marked in one pass
 * with each element's stagger carried in `--rv-delay`, so the cascade runs on
 * the compositor and a busy main thread can't bunch it up.
 *
 * Nothing is left hidden: no JS, reduced motion, or a browser without the
 * observers means it never arms; any exception, or a DOMContentLoaded that
 * doesn't come within 4s, disarms it and the page simply renders.
 *
 * Kept as literal ES2017 rather than compiled TypeScript so what ships is
 * exactly what is written here.
 */
const ENGINE = String.raw`
var d = document.documentElement;
if (!('IntersectionObserver' in window) || !('MutationObserver' in window) || !window.Promise || !window.WeakMap) return;
if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
d.classList.add('rv');

var live = false;
var bail = function () { d.classList.remove('rv'); };
setTimeout(function () { if (!live) bail(); }, 4000);

var STEP = 90;          /* stagger between neighbours in a batch; --stagger overrides */
var MAX_STEPS = 6;      /* how many steps a cascade runs to */
var FONT_WAIT = 1100;   /* longest the first screen waits on the web fonts */
var IMAGE_WAIT = 1400;  /* longest an element waits on its photograph, past its slot */
var LINE = 0.86;        /* scroll reveals fire once an element clears this share of the viewport */

var io, entered = false, sweepQueued = false;
var state = new WeakMap(); /* 1 observed · 2 waiting on its photograph · 3 shown */

var guard = function (fn) {
  return function () { try { return fn.apply(this, arguments); } catch (e) { bail(); } };
};

var collect = function (root, out) {
  if (!root || root.nodeType !== 1) return;
  if (root.hasAttribute('data-reveal') && !root.hasAttribute('data-revealed')) out.push(root);
  var list = root.querySelectorAll('[data-reveal]:not([data-revealed])');
  for (var i = 0; i < list.length; i++) out.push(list[i]);
};

var show = function (el, delay) {
  delay = Math.max(0, Math.round(delay));
  state.set(el, 3);
  el.style.setProperty('--rv-delay', delay + 'ms');
  el.setAttribute('data-revealed', '');
  /* Once a cascade has played, retire it: a child that arrives later — a
     button swapped in as someone types — should just be there, not replay
     the entrance on the container's old delay. */
  if (el.getAttribute('data-reveal') === 'stagger')
    setTimeout(function () { el.setAttribute('data-reveal-done', ''); }, delay + 2400);
};

var imageReady = function (img, cap) {
  return new Promise(function (resolve) {
    var timer = setTimeout(resolve, cap);
    var done = function () { clearTimeout(timer); resolve(); };
    var decode = function () { if (img.decode) img.decode().then(done, done); else done(); };
    if (img.complete && img.naturalWidth) decode();
    else {
      img.addEventListener('load', decode, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });
};

/* Something that is its photograph — the hero's piece, a shelf object, an
   image or figure in a post — waits for it before arriving at all, or it
   would rise as an empty box. */
var holds = function (el) {
  return el.getAttribute('data-reveal') === 'object' || el.tagName === 'IMG' || el.tagName === 'FIGURE';
};

/* Read the way the eye does: top to bottom, then left to right. Anything
   within 24px vertically counts as the same row. A pinned delay is first-
   screen choreography — the hero — so it only applies to an entrance; a
   block pinned to follow the hero on a wide screen, but below the fold on a
   phone, cascades from its own arrival there instead of waiting on it. */
var batch = function (els, firstScreen) {
  if (!els.length) return;
  var rows = els.map(function (el) {
    var r = el.getBoundingClientRect();
    return { el: el, row: Math.round(r.top / 24), left: r.left };
  });
  rows.sort(function (a, b) { return a.row - b.row || a.left - b.left; });
  var start = performance.now();
  var rank = 0;
  rows.forEach(function (item) {
    var el = item.el;
    var pinned = firstScreen ? el.getAttribute('data-reveal-delay') : null;
    var slot;
    if (pinned !== null && pinned !== '') slot = Number(pinned);
    else slot = Math.min(rank++, MAX_STEPS) * STEP;
    if (!(slot >= 0)) slot = 0;
    var img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (!img || (img.complete && img.naturalWidth)) { show(el, slot); return; }
    if (!holds(el)) {
      /* A framed block — a card, the gallery — arrives on its beat, and only
         its photograph waits: it settles into the well once it's decoded.
         Holding the whole frame back left a product's name and price
         sitting at the foot of an empty screen on a phone. The state lives
         on the block, not the image: the block is opted out of hydration
         checks, and React owns the <img>. */
      el.setAttribute('data-rv-photo', 'wait');
      show(el, slot);
      imageReady(img, 8000).then(guard(function () { el.setAttribute('data-rv-photo', 'in'); }));
      return;
    }
    state.set(el, 2);
    imageReady(img, slot + IMAGE_WAIT).then(guard(function () {
      show(el, slot - (performance.now() - start));
    }));
  });
};

var route = function (els, firstScreen) {
  var visible = [];
  var line = innerHeight * (firstScreen ? 1 : LINE);
  els.forEach(function (el) {
    if (!el.isConnected || state.has(el)) return;
    var r = el.getBoundingClientRect();
    if (r.bottom <= 0) show(el, 0);
    else if (r.top < line) visible.push(el);
    else { state.set(el, 1); io.observe(el); }
  });
  batch(visible, firstScreen);
};

/* Jumps — an anchor, End, a restored scroll position — move past elements
   without the observer ever seeing them cross, so catch them here too. */
var sweep = guard(function () {
  sweepQueued = false;
  var list = document.querySelectorAll('[data-reveal]:not([data-revealed])');
  var line = innerHeight * LINE;
  var atEnd = innerHeight + scrollY >= d.scrollHeight - 4;
  var hits = [];
  for (var i = 0; i < list.length; i++) {
    var el = list[i];
    if (state.get(el) !== 1) continue;
    var r = el.getBoundingClientRect();
    if (r.bottom <= 0) { io.unobserve(el); show(el, 0); }
    else if (r.top < line || (atEnd && r.top < innerHeight)) { io.unobserve(el); hits.push(el); }
  }
  batch(hits, false);
});
var queueSweep = function () {
  if (sweepQueued || !entered) return;
  sweepQueued = true;
  requestAnimationFrame(sweep);
};

var enter = guard(function () {
  entered = true;
  var all = [];
  collect(document.body, all);
  route(all, true);
});

var start = guard(function () {
  if (!d.classList.contains('rv')) return;
  live = true;
  var beat = parseFloat(getComputedStyle(d).getPropertyValue('--stagger'));
  if (beat > 0) STEP = beat;

  io = new IntersectionObserver(guard(function (entries) {
    var hits = [];
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      hits.push(entry.target);
    });
    batch(hits, false);
  }), { rootMargin: '0px 0px -' + Math.round((1 - LINE) * 100) + '% 0px', threshold: 0 });

  /* Client-side navigation, a filtered grid, the next step of the create
     flow: new content arrives as new nodes and gets the same entrance. */
  new MutationObserver(guard(function (records) {
    if (!entered) return;
    var fresh = [];
    records.forEach(function (record) {
      record.addedNodes.forEach(function (node) { collect(node, fresh); });
      /* A moved node is a removal and an addition; forgetting it here is what
         lets the addition route it again instead of stranding it hidden. */
      record.removedNodes.forEach(function (node) {
        var gone = [];
        collect(node, gone);
        gone.forEach(function (el) {
          io.unobserve(el);
          if (state.get(el) === 1) state.delete(el);
        });
      });
    });
    if (fresh.length) requestAnimationFrame(guard(function () { route(fresh, true); }));
  })).observe(document.body, { childList: true, subtree: true });

  addEventListener('scroll', queueSweep, { passive: true });
  addEventListener('resize', queueSweep, { passive: true });
  addEventListener('hashchange', queueSweep);
  /* iOS only applies :active once something listens for touches. */
  document.addEventListener('touchstart', function () {}, { passive: true });

  /* Laying out now is what starts the font requests, so fonts.ready then
     waits on the faces the page actually uses. Two frames on, the hidden
     state has been painted, so the entrance is something you see. */
  void document.body.offsetWidth;
  var fired = false;
  var go = function () {
    if (fired) return;
    fired = true;
    requestAnimationFrame(function () { requestAnimationFrame(enter); });
  };
  setTimeout(go, FONT_WAIT);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go, go);
  else go();
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
`;

export const MOTION_SCRIPT = `(function(){try{(function(){${ENGINE}})()}catch(e){document.documentElement.classList.remove('rv')}})();`;
