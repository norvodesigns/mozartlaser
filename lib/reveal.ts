// The markup side of the motion engine in lib/motion.ts. Kept in its own
// module so client components can use it without bundling the engine's source.

export type RevealKind =
  | 'rise'
  | 'frame'
  | 'object'
  | 'stagger'
  | 'wipe'
  | 'mask'
  | 'line'
  | 'fade';

/**
 * Props that opt an element into the choreography. `delay` pins its slot in
 * milliseconds from the start of its batch; without it the slot comes from
 * where the element sits on screen relative to its neighbours.
 *
 * suppressHydrationWarning because the engine may mark the element before
 * React hydrates it — that's the point of running it in <head>.
 */
export function reveal(kind: RevealKind = 'rise', delay?: number) {
  return {
    'data-reveal': kind,
    ...(delay === undefined ? {} : { 'data-reveal-delay': delay }),
    suppressHydrationWarning: true as const,
  };
}
