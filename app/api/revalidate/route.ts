import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * Lets the manager portal push a catalogue change to this site the moment
 * it's saved, instead of waiting out the 60s ISR window. Guarded by a
 * shared secret rather than auth, since the caller is a server (the
 * manager portal's own revalidate proxy), not a signed-in browser.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag('products');
  return NextResponse.json({ revalidated: true, tag: 'products' });
}
