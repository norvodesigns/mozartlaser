// Stores a file attached to a custom order — the customer's photo or design —
// so the order reaches the dashboard with the file itself, not just its name.
//
// The dashboard hands out a one-time upload URL (its order-files route) and
// the file goes from the browser straight to storage, so a large phone photo
// isn't cut off by a request-size limit along the way.

const ORDER_FILES_API_URL =
  process.env.NEXT_PUBLIC_ORDER_FILES_API_URL ??
  'https://dashboard.norvodesigns.com/api/public/v1/businesses/mozart-laser/order-files';

const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  pdf: 'application/pdf',
};

/** Some phones report no type for a photo; go by its extension instead. */
function typeOf(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return TYPE_BY_EXTENSION[ext] ?? '';
}

export class OrderFileError extends Error {}

const TRY_AGAIN = 'We couldn’t upload that file. Try again.';
/** How long to wait for the upload to be set up. */
const TICKET_TIMEOUT_MS = 20_000;
/** An upload that sends nothing for this long has stalled. */
const STALL_MS = 60_000;

/**
 * Uploads the file and resolves with its public URL. `onProgress` gets the
 * share sent so far, 0–1. Rejects with an OrderFileError whose message can be
 * shown to the customer as it is.
 */
export async function uploadOrderFile(
  file: File,
  onProgress?: (fraction: number) => void,
  signal?: AbortSignal
): Promise<string> {
  let ticket: { uploadUrl?: string; url?: string; error?: string };
  const setup = new AbortController();
  const giveUp = setTimeout(() => setup.abort(), TICKET_TIMEOUT_MS);
  signal?.addEventListener('abort', () => setup.abort());
  try {
    const response = await fetch(ORDER_FILES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, type: typeOf(file), size: file.size }),
      signal: setup.signal,
    });
    ticket = await response.json().catch(() => ({}));
    if (!response.ok || !ticket.uploadUrl || !ticket.url) {
      // The wrong type or size is the customer's to fix, and the server says
      // how; anything else is ours, and gets a plain "try again".
      const theirs = response.status === 413 || response.status === 415;
      throw new OrderFileError(theirs && ticket.error ? ticket.error : TRY_AGAIN);
    }
  } catch (error) {
    if (error instanceof OrderFileError) throw error;
    throw new OrderFileError('We couldn’t reach our server to upload that file. Check your connection and try again.');
  } finally {
    clearTimeout(giveUp);
  }

  // XMLHttpRequest rather than fetch, for upload progress.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', ticket.uploadUrl!);
    // No overall time limit — a big photo on a slow connection takes as long
    // as it takes — but one that stops moving for a minute has stalled.
    let stalled = false;
    let stall = setTimeout(() => ((stalled = true), xhr.abort()), STALL_MS);
    const settle = () => clearTimeout(stall);
    xhr.upload.onprogress = (event) => {
      clearTimeout(stall);
      stall = setTimeout(() => ((stalled = true), xhr.abort()), STALL_MS);
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    xhr.onload = () => {
      settle();
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new OrderFileError(TRY_AGAIN));
    };
    xhr.onerror = () => {
      settle();
      reject(new OrderFileError('The upload was interrupted. Check your connection and try again.'));
    };
    xhr.onabort = () => {
      settle();
      reject(new OrderFileError(stalled ? 'The upload stalled. Check your connection and try again.' : 'Upload cancelled.'));
    };
    signal?.addEventListener('abort', () => xhr.abort());

    const body = new FormData();
    body.append('cacheControl', '3600');
    body.append('', file);
    xhr.send(body);
  });

  onProgress?.(1);
  return ticket.url!;
}
