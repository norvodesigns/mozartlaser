'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { readStoredCart } from '@/components/CartProvider';
import { submitOrder, type OrderContact } from '@/lib/orders';

function readLastOrderContact(): OrderContact {
  try {
    const raw = window.localStorage.getItem('lastOrderContact');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed?.name === 'string' ? parsed.name : undefined,
      email: typeof parsed?.email === 'string' ? parsed.email : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * The order is paid for, so the cart it came from is spent — but it's also
 * the only record of what was ordered (custom-flow contact info included),
 * so it's read and sent to the manager portal's orders API before being
 * cleared, not after.
 */
export function ClearCart() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const items = readStoredCart();
    const contact = readLastOrderContact();
    const sessionId = searchParams.get('session_id') ?? undefined;

    submitOrder(items, contact, sessionId).finally(() => {
      try {
        window.localStorage.removeItem('cart');
        window.localStorage.removeItem('lastOrderContact');
      } catch {
        /* Storage can be unavailable; nothing here depends on it. */
      }
    });
    // Intentionally once on mount: this page is only ever landed on right
    // after a checkout, and re-running on a searchParams change would
    // resubmit the same order.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
