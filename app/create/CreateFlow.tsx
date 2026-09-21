'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { imageSize } from '@/lib/image-sizes';
import { formatPrice, type Product, type ProductImage } from '@/lib/products';
import {
  BULK_THRESHOLD,
  FONTS,
  FONT_SIZES,
  FONT_STACKS,
  ORDER_ENDPOINT,
  PERSONALIZE_FALLBACK,
  PLACEMENTS,
  blankForms,
  personalizePrices,
  unitPrice,
} from '@/lib/custom';

type Mode = 'personalize' | 'scratch';

type Errors = Partial<Record<string, string>>;

const STEPS = ['The piece', 'The engraving', 'Your details'];

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
  const topRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [mode, setMode] = useState<Mode>('personalize');
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
  const pieceImage: ProductImage | null =
    mode === 'personalize'
      ? (product?.images[0] ?? null)
      : blank
        ? { src: blank.image, width: imageSize(blank.image).w, height: imageSize(blank.image).h }
        : null;

  /**
   * One short word, shown in each face. The whole string truncates to the
   * same "For Elean…" in all eight tiles, which compares nothing — the point
   * of the samples is to tell the faces apart.
   */
  const sample = useMemo(() => {
    const first = text.trim().split(/\s+/)[0] ?? '';
    return first.slice(0, 10) || 'Abc';
  }, [text]);

  // Moving between steps replaces the whole panel. Without this you land
  // halfway down the next step on a phone, looking at a field with no heading.
  useEffect(() => {
    if (step === 0) return;
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

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

  function goTo(index: number) {
    setErrors({});
    setStep(index);
  }

  function goNext() {
    if (!validateStep(step)) return;
    const next = Math.min(step + 1, STEPS.length - 1);
    setReached((r) => Math.max(r, next));
    setStep(next);
    setErrors({});
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
      <div className="done">
        <p className="eyebrow">Order started</p>
        <h2>
          We have your <em>details</em>
        </h2>
        <p className="lede">
          Your piece is in the cart and the brief is with us. We will email a proof to{' '}
          {email} before anything is cut.
        </p>
        <div className="row">
          <a href="/products" className="btn btn--secondary">
            Keep browsing
          </a>
        </div>
      </div>
    );
  }

  const canRevisit = (index: number) => index <= reached;

  return (
    <>
      <div className="build" ref={topRef}>
        <div className="build__main">
          <ol className="progress">
            {STEPS.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? 'step' : undefined}
                data-done={index < step ? 'true' : undefined}
              >
                <button
                  type="button"
                  className="progress__go"
                  onClick={() => canRevisit(index) && goTo(index)}
                  disabled={!canRevisit(index)}
                >
                  <span className="progress__n" aria-hidden="true">
                    {index + 1}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>

          {step === 0 ? (
            <div className="panel">
              <Field label="Where are we starting?">
                <div className="picks picks--wide">
                  <Pick
                    pressed={mode === 'personalize'}
                    onClick={() => setMode('personalize')}
                    title="Personalize a piece from the shop"
                    note="We take an existing design and add your name, date or photo."
                  />
                  <Pick
                    pressed={mode === 'scratch'}
                    onClick={() => setMode('scratch')}
                    title="Design something new"
                    note="You describe it, we draw it and cut it on blank stock."
                  />
                </div>
              </Field>

              {mode === 'personalize' ? (
                <Field
                  label="Which piece"
                  hint={`Personalising is ${formatPrice(base)} — that covers the proof and the extra setup on the laser.`}
                >
                  <div className="picker" role="group" aria-label="Choose a piece">
                    {products.map((item) => (
                      <Tile
                        key={item.slug}
                        pressed={slug === item.slug}
                        onClick={() => setSlug(item.slug)}
                        image={item.images[0] ?? null}
                        title={item.name}
                        note={formatPrice(
                          personalizePrices[item.slug] ?? PERSONALIZE_FALLBACK,
                        )}
                      />
                    ))}
                  </div>
                </Field>
              ) : (
                <Field
                  label="Blank stock"
                  hint="Pick the shape and size. We cut your design into it."
                >
                  <div className="picker" role="group" aria-label="Choose blank stock">
                    {blankForms.map((form) => (
                      <Tile
                        key={form.id}
                        pressed={blankId === form.id}
                        onClick={() => setBlankId(form.id)}
                        image={{
                          src: form.image,
                          width: imageSize(form.image).w,
                          height: imageSize(form.image).h,
                        }}
                        title={form.name}
                        note={`${formatPrice(form.price)} each`}
                      />
                    ))}
                  </div>
                </Field>
              )}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="panel">
              {mode === 'personalize' ? (
                <>
                  <div
                    className={
                      errors.text ? 'ml-field ml-field--invalid' : 'ml-field'
                    }
                  >
                    <label className="ml-field__label" htmlFor="engraved-text">
                      Engraved text
                    </label>
                    <input
                      id="engraved-text"
                      className="ml-field__input"
                      value={text}
                      maxLength={60}
                      onChange={(event) => setText(event.target.value)}
                      aria-describedby="engraved-text-note"
                      placeholder="A name, a date, a line of scripture"
                    />
                    <p
                      className={errors.text ? 'ml-field__error' : 'ml-field__hint'}
                      id="engraved-text-note"
                    >
                      {errors.text ??
                        'Leave it empty if the piece only needs a design.'}
                    </p>
                  </div>

                  <Field
                    label={`Font${text.trim() ? '' : ' (once you add text)'}`}
                    error={errors.font}
                  >
                    <div className="picks" role="group" aria-label="Font">
                      {FONTS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="pick pick--font"
                          aria-pressed={font === item}
                          onClick={() => setFont(item)}
                        >
                          <span
                            className="pick__sample"
                            style={{ fontFamily: FONT_STACKS[item] ?? item }}
                          >
                            {sample}
                          </span>
                          <span className="pick__note">{item}</span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Text size" error={errors.fontSize}>
                    <div className="picks picks--row" role="group" aria-label="Text size">
                      {FONT_SIZES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="pill"
                          aria-pressed={fontSize === item}
                          onClick={() => setFontSize(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field
                    label="Where the text sits"
                    hint="Pick the closest one. Anything unusual goes in the notes below."
                    error={errors.placement}
                  >
                    <div className="picks picks--row" role="group" aria-label="Placement">
                      {PLACEMENTS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="pill"
                          aria-pressed={placement === item}
                          onClick={() => setPlacement(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </Field>

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
                      What you want made
                    </label>
                    <textarea
                      id="changes"
                      className="ml-field__input"
                      rows={6}
                      value={changes}
                      onChange={(event) => setChanges(event.target.value)}
                      placeholder="The design, the words, the feel of it."
                    />
                    <p className={errors.changes ? 'ml-field__error' : 'ml-field__hint'}>
                      {errors.changes ??
                        'The more you give us, the closer the first proof lands.'}
                    </p>
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
                  background. If a design needs drawing from scratch there is an
                  additional fee — email{' '}
                  <a href="mailto:mozartlaser@gmail.com">mozartlaser@gmail.com</a> and
                  we will quote it.
                </p>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="panel">
              <Field
                label="How many"
                hint={
                  mode === 'scratch'
                    ? `${BULK_THRESHOLD} or more of one design takes 10% off.`
                    : undefined
                }
              >
                <span className="qty qty--lg">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="One fewer"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="One more"
                  >
                    +
                  </button>
                </span>
              </Field>

              <div className="form-grid">
                <div className={errors.name ? 'ml-field ml-field--invalid' : 'ml-field'}>
                  <label className="ml-field__label" htmlFor="your-name">
                    Your name
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
                    Email
                  </label>
                  <input
                    id="your-email"
                    className="ml-field__input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                  <p className={errors.email ? 'ml-field__error' : 'ml-field__hint'}>
                    {errors.email ?? 'This is where the proof goes.'}
                  </p>
                </div>

                <div
                  className={
                    errors.emailConfirm
                      ? 'ml-field ml-field--invalid span-2'
                      : 'ml-field span-2'
                  }
                >
                  <label className="ml-field__label" htmlFor="your-email-confirm">
                    Confirm email
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
            </div>
          ) : null}

          <div className="form-actions">
            {step > 0 ? (
              <button type="button" className="btn btn--secondary" onClick={goBack}>
                Back
              </button>
            ) : null}
            {step < 2 ? (
              <button type="button" className="btn" onClick={goNext}>
                Next
              </button>
            ) : (
              <button type="button" className="btn btn--lg" onClick={handleSubmit}>
                Add to cart · {formatPrice(total)}
              </button>
            )}
          </div>
        </div>

        {/* The piece, the running spec and the price, visible the whole way
            through. Filling in a brief for something you cannot see was the
            main reason this flow felt like paperwork. */}
        <aside className="build__aside" aria-label="Your piece so far">
          <div className="build__head">
            <span className="build__stage">
              {pieceImage ? (
                <Image
                  key={pieceImage.src}
                  src={pieceImage.src}
                  alt={pieceName}
                  width={pieceImage.width}
                  height={pieceImage.height}
                  sizes="(max-width: 900px) 96px, 320px"
                />
              ) : null}
            </span>
            <div className="build__id">
              <p className="eyebrow">
                {mode === 'personalize' ? 'Personalised' : 'Made to order'}
              </p>
              <p className="build__name">{pieceName || 'Pick a piece'}</p>
            </div>
          </div>

          <dl className="spec-list">
            {mode === 'personalize' ? (
              <>
                <SpecRow label="Text" value={text.trim()} />
                <SpecRow label="Font" value={font} />
                <SpecRow label="Size" value={fontSize} />
                <SpecRow label="Placement" value={placement} />
              </>
            ) : (
              <SpecRow label="Brief" value={changes.trim()} />
            )}
            <SpecRow label="Design file" value={fileName} />
            <SpecRow label="Quantity" value={quantity > 1 ? String(quantity) : ''} />
          </dl>

          <p className="build__price">
            <span>
              {quantity > 1 ? `${formatPrice(each)} each` : 'Total'}
              {bulkApplies ? ' · 10% off' : ''}
            </span>
            <strong className="tabular">{formatPrice(total)}</strong>
          </p>
          <p className="caption">
            Nothing is cut until you approve a proof. Ships in 3–5 days.
          </p>
        </aside>
      </div>

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

/** A labelled group. Fieldset/legend can't be laid out reliably, so this. */
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field" role="group" aria-label={label}>
      <p className="field__label">{label}</p>
      {children}
      {error ? (
        <p className="ml-field__error">{error}</p>
      ) : hint ? (
        <p className="ml-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

function Pick({
  pressed,
  onClick,
  title,
  note,
}: {
  pressed: boolean;
  onClick: () => void;
  title: string;
  note: string;
}) {
  return (
    <button type="button" className="pick" aria-pressed={pressed} onClick={onClick}>
      <span className="pick__title">{title}</span>
      <span className="pick__note">{note}</span>
    </button>
  );
}

function Tile({
  pressed,
  onClick,
  image,
  title,
  note,
}: {
  pressed: boolean;
  onClick: () => void;
  image: ProductImage | null;
  title: string;
  note: string;
}) {
  return (
    <button type="button" className="tile" aria-pressed={pressed} onClick={onClick}>
      <span className="tile__media">
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="140px"
          />
        ) : null}
      </span>
      <span className="tile__name">{title}</span>
      <span className="tile__note">{note}</span>
    </button>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="spec-list__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
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
    <>
      <Field
        label="Upload a design or photo"
        hint="Optional. JPG or PNG, the simpler the better."
      >
        {/* The native file input is unstyleable, so it sits invisibly over a
            drop zone we can style. The label still drives it, so the keyboard
            and screen readers get the real control. */}
        <label className="drop" data-filled={fileName || undefined}>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              onFile(file ? file.name : '');
              // Mirror the chosen file into the form that actually posts.
              if (fileRef.current) fileRef.current.files = event.target.files;
            }}
          />
          <span className="drop__title">
            {fileName ? fileName : 'Choose an image'}
          </span>
          <span className="drop__note">
            {fileName ? 'Attached — tap to replace' : 'Or drag one in'}
          </span>
        </label>
      </Field>

      {fileName ? (
        <div className={error ? 'ml-field ml-field--invalid' : 'ml-field'}>
          <label className="ml-field__label" htmlFor="file-placement">
            Where the design goes
          </label>
          <input
            id="file-placement"
            className="ml-field__input"
            value={filePlacement}
            onChange={(event) => setFilePlacement(event.target.value)}
          />
          {error ? <p className="ml-field__error">{error}</p> : null}
        </div>
      ) : null}
    </>
  );
}
