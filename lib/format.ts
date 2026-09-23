// Formatting that client components need. Kept apart from lib/products.ts,
// whose static catalogue would otherwise ride along into every client bundle
// that wanted to print a price.

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** Media in the gallery may be a still or a short clip. */
export function isVideo(src: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(src);
}
