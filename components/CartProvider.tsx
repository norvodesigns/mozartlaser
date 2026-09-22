'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CartItem = {
  /** Stable key for the line. Stripe id where there is one, else a made id. */
  id: string;
  /** What the customer reads in the drawer. */
  name: string;
  /**
   * The line-item name Stripe receives. The catalogue's Stripe names are long
   * and keyword-stuffed, so the drawer shows `name` and checkout sends this.
   */
  checkoutName?: string;
  price: number;
  priceId: string | null;
  quantity: number;
  /** Engraving notes on a made-to-order line, shown under the name. */
  detail?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, 'id' | 'quantity'> & { id?: string }) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  checkout: () => Promise<void>;
  checkoutState: 'idle' | 'loading' | 'error';
};

const STORAGE_KEY = 'cart';

const CHECKOUT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHECKOUT_ENDPOINT ??
  'https://mozart-backend.onrender.com/create-checkout-session';

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Reads the cart the old site left in localStorage, in its old shape. Also
 * used by the order-success page to see what was just bought before
 * ClearCart wipes it — see lib/orders.ts.
 */
export function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((raw) => raw && typeof raw.name === 'string')
      .map((raw, index) => ({
        id: typeof raw.id === 'string' ? raw.id : (raw.priceId ?? `line-${index}`),
        name: raw.name,
        checkoutName:
          typeof raw.checkoutName === 'string' ? raw.checkoutName : raw.name,
        price: Number(raw.price) || 0,
        priceId: raw.priceId ?? null,
        quantity: Math.max(1, Number(raw.quantity) || 1),
        detail: typeof raw.detail === 'string' ? raw.detail : undefined,
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Storage can be unavailable; the cart still works for this visit. */
    }
  }, [items, hydrated]);

  // The scroll lock, Escape and focus handling for the drawer live in
  // useOverlay, which the drawer itself uses. This provider deliberately keeps
  // no copy: two independent locks on body.style.overflow deadlock each other.

  const add = useCallback<CartContextValue['add']>((item) => {
    setItems((current) => {
      // A made-to-order line is unique every time; a catalogue line merges.
      if (item.priceId) {
        const existing = current.find((line) => line.priceId === item.priceId);
        if (existing) {
          return current.map((line) =>
            line.priceId === item.priceId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        }
      }
      const id =
        item.id ??
        item.priceId ??
        `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return [...current, { ...item, id, quantity: 1 }];
    });
    setCheckoutState('idle');
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((line) => line.id !== id));
  }, []);

  const checkout = useCallback(async () => {
    if (items.length === 0) return;
    setCheckoutState('loading');
    try {
      const response = await fetch(CHECKOUT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The backend reads `name`, so send the Stripe-facing one there.
        body: JSON.stringify({
          items: items.map((line) => ({
            ...line,
            name: line.checkoutName ?? line.name,
          })),
        }),
      });
      const session = await response.json();
      if (session?.url) {
        window.location.href = session.url;
        return;
      }
      setCheckoutState('error');
    } catch {
      setCheckoutState('error');
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0);
    const total = items.reduce((sum, line) => sum + line.price * line.quantity, 0);
    return {
      items,
      count,
      total,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      checkout,
      checkoutState,
    };
  }, [items, isOpen, add, setQuantity, remove, checkout, checkoutState]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
