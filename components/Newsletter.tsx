'use client';

import { useId, useState } from 'react';
import { MESSAGES, isValidEmail, subscribe } from '@/lib/email';

type State = 'idle' | 'sending' | 'ok' | 'error';

export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setState('error');
      setMessage(MESSAGES.invalid);
      return;
    }
    setState('sending');
    setMessage('');
    try {
      await subscribe(email);
      setState('ok');
      setMessage(MESSAGES.success);
      setEmail('');
    } catch {
      setState('error');
      setMessage(MESSAGES.failed);
    }
  }

  return (
    <section className="signup" aria-labelledby={`${id}-heading`} data-reveal>
      <div>
        <h2 id={`${id}-heading`}>Stay in the loop &amp; get 5% off</h2>
        <p>
          Early access to new products and exclusive discounts. Enter your email for a
          5% off coupon.
        </p>
      </div>
      <div>
        <form onSubmit={onSubmit} noValidate>
          <label className="visually-hidden" htmlFor={`${id}-email`}>
            Email address
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (state === 'error') {
                setState('idle');
                setMessage('');
              }
            }}
            aria-invalid={state === 'error' || undefined}
            aria-describedby={message ? `${id}-status` : undefined}
          />
          <button className="btn" type="submit" aria-disabled={state === 'sending' || undefined}>
            {state === 'sending' ? 'Sending…' : 'Subscribe'}
          </button>
        </form>
        {/* The status carries a word, never colour alone. */}
        <p
          className="signup__status"
          id={`${id}-status`}
          data-state={state === 'ok' ? 'ok' : state === 'error' ? 'error' : undefined}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </section>
  );
}
