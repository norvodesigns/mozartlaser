/**
 * Newsletter signup, carried over from the old site unchanged: the same EmailJS
 * account, service and two templates (one notifies the studio, one confirms to
 * the customer). The SDK is fetched on first use rather than on page load, so
 * it costs nothing until somebody actually subscribes.
 */

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

const PUBLIC_KEY = '7UOLAF6QlXTdX66_L';
const SERVICE = 'mozartlaser';
const TEMPLATE_NOTIFY = 'mozart_notify';
const TEMPLATE_CONFIRM = 'mozart_confirm';

type EmailJs = {
  init: (key: string) => void;
  send: (service: string, template: string, params: Record<string, string>) => Promise<unknown>;
};

declare global {
  interface Window {
    emailjs?: EmailJs;
  }
}

let loader: Promise<EmailJs> | null = null;

function loadSdk(): Promise<EmailJs> {
  if (loader) return loader;

  loader = new Promise<EmailJs>((resolve, reject) => {
    if (window.emailjs) {
      window.emailjs.init(PUBLIC_KEY);
      resolve(window.emailjs);
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      if (!window.emailjs) {
        reject(new Error('EmailJS loaded but did not register'));
        return;
      }
      window.emailjs.init(PUBLIC_KEY);
      resolve(window.emailjs);
    };
    script.onerror = () => reject(new Error('EmailJS failed to load'));
    document.head.appendChild(script);
  });

  return loader;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function subscribe(email: string): Promise<void> {
  const emailjs = await loadSdk();
  const params = { user_email: email.trim() };
  await emailjs.send(SERVICE, TEMPLATE_NOTIFY, params);
  await emailjs.send(SERVICE, TEMPLATE_CONFIRM, params);
}

/** The studio's own words, kept verbatim from the old flyout. */
export const MESSAGES = {
  invalid: 'Please enter a valid email address.',
  failed: 'Something went wrong. Please try again.',
  success: "You're signed up! Your 5% off coupon will arrive within a few hours.",
} as const;
