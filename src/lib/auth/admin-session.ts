export const COOKIE_NAME = "umie_admin_session";

function getRawSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    ""
  );
}

function toB64u(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i]!);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64u(b64u: string): Uint8Array {
  const padded =
    b64u.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((4 - (b64u.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacSign(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(message)
  );
  return toB64u(new Uint8Array(sig));
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = getRawSecret();
  if (!secret) throw new Error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET required");
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = toB64u(new TextEncoder().encode(String(exp)));
  const sig = await hmacSign(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const secret = getRawSecret();
  if (!secret) return false;
  const [payload, sig] = token.split(".", 2);
  if (!payload || !sig) return false;
  let expected: string;
  try {
    expected = await hmacSign(secret, payload);
  } catch {
    return false;
  }
  if (!timingSafeEqualStr(sig, expected)) return false;

  try {
    const bytes = fromB64u(payload);
    const expStr = new TextDecoder().decode(bytes);
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return false;
  } catch {
    return false;
  }
  return true;
}
