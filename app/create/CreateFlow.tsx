'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { imageSize } from '@/lib/image-sizes';
import { formatPrice, type Product } from '@/lib/products';
import {
  BULK_THRESHOLD,
  FONTS,
  FONT_SIZES,
  ORDER_ENDPOINT,
  PERSONALIZE_FALLBACK,
  blankForms,
  personalizePrices,
  unitPrice,
} from '@/lib/custom';

type Mode = 'personalize' | 'scratch';

type Errors = Partial<Record<string, string>>;

const STEPS = ['What we are making', 'The engraving', 'Your details'];

export function CreateFlow({
  products,
  initialSlug,
  initialText,
}: {
  products: Product[];
  initialSlug: string | null;
  /** Carried over when somebody typed engraving text on a product page. */
  initialText: string;
}) {
  const { add } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>(initialSlug ? 'personalize' : 'personalize');
  const [slug, setSlug] = useState(initialSlug ?? products[0]?.slug ?? '');
  const [blankId, setBlankId] = useState(blankForms[0]?.id ?? '');

  const [text, setText] = useState(initialText);
  const [font, setFont] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [placement, setPlacement] = useState('');
  const [filePlacement, setFilePlacement] = useState('');
  const [changes, setChanges] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const product = products.find((p) => p.slug === slug);
  const blank = blankForms.find((b) => b.id === blankId);

  const base =
    mode === 'personalize'
      ? (personalizePrices[slug] ?? PERSONALIZE_FALLBACK)
      : (blank?.price ?? 0);

  const each = unitPrice(base, quantity, mode === 'scratch');
  const total = each * quantity;
  const bulkApplies = mode === 'scratch' && quantity >= BULK_THRESHOLD;

  const pieceName = useMemo(
    () => (mode === 'personalize' ? (product?.name ?? '') : (blank?.name ?? '')),
    [mode, product, blank],
  );

  function validateStep(index: number): boolean {
    const next: Errors = {};

    if (index === 1) {
      if (mode === 'personalize') {
        // The old flow made font, size and placement conditional on text.
        if (text.trim()) {
          if (!font) next.font = 'Pick the font you want the text cut in.';
          if (!fontSize) next.fontSize = 'Pick how large the text should be.';
          if (!placement.trim())
            next.placement = 'Say where on the piece the text should sit.';
        }
        if (fileName && !filePlacement.trim()) {
          next.filePlacement = 'Say where the uploaded design should go.';
        }
        if (!text.trim() && !fileName && !notes.trim()) {
          next.text =
            'Add engraving text, upload a design, or tell us what you want in the notes.';
        }
      } else if (!changes.trim()) {
        next.changes = 'Describe what you want made so we can price and draw it.';
      }
    }

    if (index === 2) {
      if (!name.trim()) next.name = 'Add your name so we know whose order this is.';
      if (!email.trim()) {
        next.email = 'Add an email so we can send your proof.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        next.email = 'Check the email address — we could not read that one.';
      }
      if (email.trim() !== emailConfirm.trim()) {
        next.emailConfirm = 'Type the same email again so we know it is right.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  function handleSubmit() {
    if (!validateStep(2)) return;

    const detail = [
      `Text: ${text.trim() || 'None'}`,
      `Font: ${font || 'None'}`,
      `Size: ${fontSize || 'None'}`,
      `Placement: ${placement.trim() || 'None'}`,
      `File: ${fileName || 'None'}`,
      `File placement: ${filePlacement.trim() || 'None'}`,
      `Quantity: ${quantity}${bulkApplies ? ', bulk discount 10%' : ''}`,
    ].join('\n');

    // Posts into the hidden iframe, exactly as the old form did, so the
    // order backend keeps receiving the same fields and the file upload.
    formRef.current?.submit();

    add({
      name: `${pieceName} — made to order`,
      price: total,
      priceId: null,
      detail,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="stack" style={{ gap: 'var(--space-5)' }}>
        <div className="head">
          <p className="eyebrow">Order started</p>
          <h2>
            We have your <em>details</em>
          </h2>
          <p className="lede">
            Your piece is in the cart and the brief is with us. We will email a proof
            to {email} before anything is cut.
          </p>
        </div>
        <div className="row">
          <a href="/products" className="btn btn--secondary">
            Keep browsing
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <ol className="progress">
        {STEPS.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? 'step' : undefined}
            data-done={index < step ? 'true' : undefined}
          >
            <span className="progress__n" aria-hidden="true">
              {index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="stack" style={{ gap: 'var(--space-7)' }}>
          <fieldset className="stack" style={{ border: 0, gap: 'var(--space-4)' }}>
            <legend className="label" style={{ marginBottom: 'var(--space-3)' }}>
              Where are we starting?
            </legend>
            <div className="options">
              <button
                type="button"
                className="option"
                aria-pressed={mode === 'personalize'}
                onClick={() => setMode('personalize')}
              >
                <span className="option__name">Personalize a piece from the shop</span>
                <span className="option__price">
                  We take an existing design and add your name, date or photo.
                </span>
              </button>
              <button
                type="button"
                className="option"
                aria-pressed={mode === 'scratch'}
                onClick={() => setMode('scratch')}
              >
                <span className="option__name">Design something new</span>
                <span className="option__price">
                  You describe it, we draw it and cut it on blank stock.
                </span>
              </button>
            </div>
          </fieldset>

          {mode === 'personalize' ? (
            <div className="ml-field" style={{ maxWidth: 420 }}>
              <label className="ml-field__label" htmlFor="piece">
                Which piece
              </label>
              <select
                id="piece"
                className="ml-field__input"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              >
                {products.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className="ml-field__hint">
                Personalising is {formatPrice(base)} — it includes the proof and the
                extra setup on the laser.
              </p>
            </div>
          ) : (
            <fieldset className="stack" style={{ border: 0, gap: 'var(--space-4)' }}>
              <legend className="label" style={{ marginBottom: 'var(--space-3)' }}>
                Blank stock
              </legend>
              <div className="options">
                {blankForms.map((form) => (
                  <button
                    key={form.id}
                    type="button"
                    className="option"
                    aria-pressed={blankId === form.id}
                    onClick={() => setBlankId(form.id)}
                  >
                    <span className="option__media">
                      <Image
                        src={form.image}
                        alt=""
                        width={imageSize(form.image).w}
                        height={imageSize(form.image).h}
                        sizes="220px"
                      />
                    </span>
                    <span className="option__name">{form.name}</span>
                    <span className="option__price">{formatPrice(form.price)} each</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="form-actions form-actions--end">
            <button type="button" className="btn" onClick={goNext}>
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="stack" style={{ gap: 'var(--space-6)' }}>
          {mode === 'personalize' ? (
            <>
              <div className="form-grid">
                <div
                  className={
                    errors.text ? 'ml-field ml-field--invalid span-2' : 'ml-field span-2'
                  }
                >
                  <label className="ml-field__label" htmlFor="engraved-text">
                    Engraved text
                  </label>
                  <input
                    id="engraved-text"
                    className="ml-field__input"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    aria-describedby={errors.text ? 'engraved-text-error' : undefined}
                  />
                  {errors.text ? (
                    <p className="ml-field__error" id="engraved-text-error">
                      {errors.text}
                    </p>
                  ) : (
                    <p className="ml-field__hint">
                      A name, a date, a line of scripture. Leave it empty if the piece
                      only needs a design.
                    </p>
                  )}
                </div>

                <div className={errors.font ? 'ml-field ml-field--invalid' : 'ml-field'}>
                  <label className="ml-field__label" htmlFor="font">
                    Font {text.trim() ? '(required)' : ''}
                  </label>
                  <select
                    id="font"
                    className="ml-field__input"
                    value={font}
                    onChange={(event) => setFont(event.target.value)}
                  >
                    <option value="">Select a font</option>
                    {FONTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.font ? <p className="ml-field__error">{errors.font}</p> : null}
                </div>

                <div
                  className={errors.fontSize ? 'ml-field ml-field--invalid' : 'ml-field'}
                >
                  <label className="ml-field__label" htmlFor="font-size">
                    Text size {text.trim() ? '(required)' : ''}
                  </label>
                  <select
                    id="font-size"
                    className="ml-field__input"
                    value={fontSize}
                    onChange={(event) => setFontSize(event.target.value)}
                  >
                    <option value="">Select a size</option>
                    {FONT_SIZES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errors.fontSize ? (
                    <p className="ml-field__error">{errors.fontSize}</p>
                  ) : null}
                </div>

                <div
                  className={
                    errors.placement
                      ? 'ml-field ml-field--invalid span-2'
                      : 'ml-field span-2'
                  }
                >
                  <label className="ml-field__label" htmlFor="placement">
                    Text placement {text.trim() ? '(required)' : ''}
                  </label>
                  <input
                    id="placement"
                    className="ml-field__input"
                    value={placement}
                    onChange={(event) => setPlacement(event.target.value)}
                  />
                  {errors.placement ? (
                    <p className="ml-field__error">{errors.placement}</p>
                  ) : (
                    <p className="ml-field__hint">
                      Where on the piece, and which side — &ldquo;centred under the
                      engraving, front&rdquo;.
                    </p>
                  )}
                </div>
              </div>

              <UploadField
                fileRef={fileRef}
                fileName={fileName}
                onFile={setFileName}
                filePlacement={filePlacement}
                setFilePlacement={setFilePlacement}
                error={errors.filePlacement}
              />

              <div className="ml-field">
                <label className="ml-field__label" htmlFor="notes">
                  Anything else
                </label>
                <textarea
                  id="notes"
                  className="ml-field__input"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
                <p className="ml-field__hint">
                  Gift deadlines, a second side, a change to the original design.
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className={errors.changes ? 'ml-field ml-field--invalid' : 'ml-field'}
              >
                <label className="ml-field__label" htmlFor="changes">
                  What you want made (required)
                </label>
                <textarea
                  id="changes"
                  className="ml-field__input"
                  rows={5}
                  value={changes}
                  onChange={(event) => setChanges(event.target.value)}
                />
                {errors.changes ? (
                  <p className="ml-field__error">{errors.changes}</p>
                ) : (
                  <p className="ml-field__hint">
                    Describe the design, the words and the feel. The more you give us,
                    the closer the first proof lands.
                  </p>
                )}
              </div>

              <UploadField
                fileRef={fileRef}
                fileName={fileName}
                onFile={setFileName}
                filePlacement={filePlacement}
                setFilePlacement={setFilePlacement}
                error={errors.filePlacement}
              />
            </>
          )}

          <div className="callout">
            <p className="callout__title">Graphic design work</p>
            <p className="callout__body">
              Photographs should be simple, with a clear subject against a plain
              background. If a design needs drawing from scratch there is an additional
              fee — email{' '}
              <a href="mailto:mozartlaser@gmail.com">mozartlaser@gmail.com</a> and we
              will quote it.
            </p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={goBack}>
              Back
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="stack" style={{ gap: 'var(--space-6)' }}>
          <div className="form-grid">
            <div className="ml-field">
              <label className="ml-field__label" htmlFor="quantity">
                How many (required)
              </label>
              <input
                id="quantity"
                className="ml-field__input"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Math.max(1, Number(event.target.value) || 1))
                }
              />
              {mode === 'scratch' ? (
                <p className="ml-field__hint">
                  {BULK_THRESHOLD} or more of one design takes 10% off.
                </p>
              ) : null}
            </div>

            <div className={errors.name ? 'ml-field ml-field--invalid' : 'ml-field'}>
              <label className="ml-field__label" htmlFor="your-name">
                Your name (required)
              </label>
              <input
                id="your-name"
                className="ml-field__input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
              {errors.name ? <p className="ml-field__error">{errors.name}</p> : null}
            </div>

            <div className={errors.email ? 'ml-field ml-field--invalid' : 'ml-field'}>
              <label className="ml-field__label" htmlFor="your-email">
                Email (required)
              </label>
              <input
                id="your-email"
                className="ml-field__input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              {errors.email ? (
                <p className="ml-field__error">{errors.email}</p>
              ) : (
                <p className="ml-field__hint">This is where the proof goes.</p>
              )}
            </div>

            <div
              className={errors.emailConfirm ? 'ml-field ml-field--invalid' : 'ml-field'}
            >
              <label className="ml-field__label" htmlFor="your-email-confirm">
                Confirm email (required)
              </label>
              <input
                id="your-email-confirm"
                className="ml-field__input"
                type="email"
                value={emailConfirm}
                onChange={(event) => setEmailConfirm(event.target.value)}
                autoComplete="email"
              />
              {errors.emailConfirm ? (
                <p className="ml-field__error">{errors.emailConfirm}</p>
              ) : null}
            </div>
          </div>

          <dl className="summary">
            <div className="summary__row">
              <dt>{pieceName}</dt>
              <dd>
                {formatPrice(each)} each{bulkApplies ? ', bulk discount applied' : ''}
              </dd>
            </div>
            <div className="summary__row">
              <dt>Quantity</dt>
              <dd>{quantity}</dd>
            </div>
            <div className="summary__row summary__row--total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={goBack}>
              Back
            </button>
            <button type="button" className="btn btn--lg" onClick={handleSubmit}>
              Add to cart
            </button>
          </div>
        </div>
      ) : null}

      {/* The order brief posts into a hidden frame so the file upload keeps
          working without a cross-origin request. Field names are unchanged. */}
      <iframe name="order-frame" title="Order submission" style={{ display: 'none' }} />
      <form
        ref={formRef}
        method="POST"
        action={ORDER_ENDPOINT}
        encType="multipart/form-data"
        target="order-frame"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <input type="hidden" name="subject" value="New Custom Order from Mozart Laser" />
        <input type="hidden" name="from_name" value="MozartLaser.com" />
        <input
          type="hidden"
          name="flow_type"
          value={mode === 'personalize' ? 'customize-existing' : 'create-your-own'}
        />
        <input type="hidden" name="product" value={pieceName} />
        <input type="hidden" name="selected_product" value={pieceName} />
        <input type="hidden" name="engraved_text" value={text} />
        <input type="hidden" name="font" value={font} />
        <input type="hidden" name="font_size" value={fontSize} />
        <input type="hidden" name="text_location" value={placement} />
        <input type="hidden" name="file_placement" value={filePlacement} />
        <input type="hidden" name="custom_file_placement" value={filePlacement} />
        <input type="hidden" name="custom_changes" value={changes} />
        <input type="hidden" name="additional_notes" value={notes} />
        <input type="hidden" name="total_price" value={total.toFixed(2)} />
        <input type="hidden" name="order_quantity" value={quantity} />
        <input type="hidden" name="customer_name" value={name} />
        <input type="hidden" name="replyto" value={email} />
        <input ref={fileRef} type="file" name="design_file" />
      </form>
    </>
  );
}

function UploadField({
  fileRef,
  fileName,
  onFile,
  filePlacement,
  setFilePlacement,
  error,
}: {
  fileRef: React.RefObject<HTMLInputElement>;
  fileName: string;
  onFile: (name: string) => void;
  filePlacement: string;
  setFilePlacement: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="form-grid">
      <div className="ml-field">
        <label className="ml-field__label" htmlFor="design-file">
          Upload a design or photo
        </label>
        <input
          id="design-file"
          className="ml-field__input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            onFile(file ? file.name : '');
            // Mirror the chosen file into the form that actually posts.
            if (fileRef.current) fileRef.current.files = event.target.files;
          }}
        />
        <p className="ml-field__hint">
          {fileName ? `Attached: ${fileName}` : 'Optional. JPG or PNG works best.'}
        </p>
      </div>

      <div className={error ? 'ml-field ml-field--invalid' : 'ml-field'}>
        <label className="ml-field__label" htmlFor="file-placement">
          Where the design goes {fileName ? '(required)' : ''}
        </label>
        <input
          id="file-placement"
          className="ml-field__input"
          value={filePlacement}
          onChange={(event) => setFilePlacement(event.target.value)}
        />
        {error ? <p className="ml-field__error">{error}</p> : null}
      </div>
    </div>
  );
}
