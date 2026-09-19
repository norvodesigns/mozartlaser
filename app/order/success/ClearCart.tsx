'use client';

import { useEffect } from 'react';

/** The order is paid for, so the cart it came from is spent. */
export function ClearCart() {
  useEffect(() => {
    try {
      window.localStorage.removeItem('cart');
    } catch {
      /* Storage can be unavailable; nothing here depends on it. */
    }
  }, []);

  return null;
}
