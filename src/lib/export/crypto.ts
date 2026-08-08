// AES-256-GCM with a PBKDF2-derived key, entirely via the browser's native Web Crypto API:
// no extra dependency, and it never leaves the device (consistent with the rest of the app).
const PBKDF2_ITERATIONS = 210_000; // OWASP 2023 minimum recommendation for PBKDF2-HMAC-SHA256

export interface EncryptedEnvelope {
  encrypted: true;
  kdf: string;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptText(plainText: string, password: string): Promise<Omit<EncryptedEnvelope, 'encrypted' | 'kdf'>> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, PBKDF2_ITERATIONS);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plainText));
  return { salt: toBase64(salt), iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(cipherBuffer)), iterations: PBKDF2_ITERATIONS };
}

// AES-GCM's auth tag rejects any wrong key on its own, so a bad password surfaces here as a
// thrown DOMException rather than silently producing garbage plaintext.
export async function decryptText(envelope: Pick<EncryptedEnvelope, 'salt' | 'iv' | 'ciphertext' | 'iterations'>, password: string): Promise<string> {
  const salt = fromBase64(envelope.salt);
  const iv = fromBase64(envelope.iv);
  const key = await deriveKey(password, salt, envelope.iterations);
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, fromBase64(envelope.ciphertext));
  return new TextDecoder().decode(plainBuffer);
}
