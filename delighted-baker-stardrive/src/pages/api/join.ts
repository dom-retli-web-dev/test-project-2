import type { APIRoute } from 'astro';
import { env as CFEnv } from 'cloudflare:workers';

// ---------------------------------------------------------------------------
// Bread List signup endpoint.
//
// Receives { name, phone } form submissions from the /join page and stores
// them in the Cloudflare KV namespace `BREAD_LIST`. The baker reads them on
// the protected /bread-list page and reaches out by text.
// ---------------------------------------------------------------------------

export const prerender = false;

interface BreadListEntry {
  name: string;
  phone: string;
  createdAt: string;
}

const MAX_NAME_LENGTH = 120;
const MAX_RESPONSES = 512;
const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

const stripPhone = (raw: string): string => raw.replace(/\D/g, '');

const isValidPhone = (phone: string): boolean => phone.length >= MIN_DIGITS && phone.length <= MAX_DIGITS;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid-body' }, 400);
  }

  // Honeypot: bots fill hidden fields, humans don't. If present, pretend success.
  if (String(form.get('company') ?? '') !== '') {
    return json({ ok: true });
  }

  const rawName = String(form.get('name') ?? '').trim();
  const phone = stripPhone(String(form.get('phone') ?? ''));

  if (!rawName) return json({ ok: false, error: 'name-required' }, 400);
  if (rawName.length > MAX_NAME_LENGTH) return json({ ok: false, error: 'name-too-long' }, 400);
  if (!isValidPhone(phone)) return json({ ok: false, error: 'phone-invalid' }, 400);

  const entry: BreadListEntry = {
    name: rawName,
    phone,
    createdAt: new Date().toISOString(),
  };

  try {
    const kv = CFEnv.BREAD_LIST;
    if (!kv) {
      return json({ ok: false, error: 'storage-unavailable' }, 503);
    }
    await kv.put(`signup:${crypto.randomUUID()}`, JSON.stringify(entry));
  } catch {
    return json({ ok: false, error: 'storage-error' }, 503);
  }

  return json({ ok: true, message: 'Thanks! The baker will be in touch.' }, 201);
};

export const GET: APIRoute = async () => {
  try {
    const kv = CFEnv.BREAD_LIST;
    if (!kv) {
      return json({ ok: false, error: 'storage-unavailable' }, 503);
    }
    const { keys } = await kv.list({ prefix: 'signup:', limit: MAX_RESPONSES });
    return json({ ok: true, entries: keys });
  } catch {
    return json({ ok: false, error: 'storage-error' }, 503);
  }
};
