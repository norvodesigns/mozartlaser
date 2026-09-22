// Sends a completed cart to the manager portal so it lands somewhere an
// owner can actually see and fulfill it — see the note on ClearCart.tsx.

import type { CartItem } from '@/components/CartProvider';

const ORDERS_API_URL =
  process.env.NEXT_PUBLIC_ORDERS_API_URL ??
  'https://dashboard.norvodesigns.com/api/public/v1/businesses/mozart-laser/orders';

export interface OrderContact {
  name?: string;
  email?: string;
}

/**
 * Best-effort: a failure here must never block the confirmation page or
 * throw in a useEffect. The cart is the only record of what was ordered by
 * the time this runs, so it's read and sent before ClearCart clears it.
 */
export async function submitOrder(
  items: CartItem[],
  contact: OrderContact,
  stripeSessionId?: string
): Promise<void> {
  if (items.length === 0) return;

  // A made-to-order line has no Stripe price id (see CartItem/ProductBuy);
  // its presence is what distinguishes a custom-flow order from a plain
  // catalogue checkout.
  const source = items.some((item) => !item.priceId) ? 'custom_flow' : 'cart';

  try {
    await fetch(ORDERS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: contact.name,
        customer_email: contact.email,
        source,
        stripe_session_id: stripeSessionId,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          detail: item.detail,
        })),
      }),
    });
  } catch {
    /* The order backend being unreachable shouldn't strand the customer on
       their own confirmation page. */
  }
}
