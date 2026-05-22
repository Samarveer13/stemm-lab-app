import * as SecureStore from "expo-secure-store";
import * as ExpoCrypto from "expo-crypto";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY_ALIAS = "stemm_lab_enc_key";
const ENC_PREFIX = "enc:";

let cachedKey: string | null = null;

async function getOrCreateKey(): Promise<string> {
  if (cachedKey) return cachedKey;
  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_ALIAS);
  if (!key) {
    const bytes = await ExpoCrypto.getRandomBytesAsync(32);
    key = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, key);
  }
  cachedKey = key;
  return key;
}

function toWordArray(bytes: Uint8Array): CryptoJS.lib.WordArray {
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(
      ((bytes[i] ?? 0) << 24) |
        ((bytes[i + 1] ?? 0) << 16) |
        ((bytes[i + 2] ?? 0) << 8) |
        (bytes[i + 3] ?? 0)
    );
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

export async function encrypt(plaintext: string): Promise<string> {
  const keyHex = await getOrCreateKey();
  const keyWA = CryptoJS.enc.Hex.parse(keyHex);

  const ivBytes = await ExpoCrypto.getRandomBytesAsync(16);
  const ivWA = toWordArray(ivBytes);
  const ivHex = Array.from(ivBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const ciphertext = CryptoJS.AES.encrypt(plaintext, keyWA, { iv: ivWA }).toString();
  return `${ENC_PREFIX}${ivHex}:${ciphertext}`;
}

export async function decrypt(value: string): Promise<string> {
  if (!value.startsWith(ENC_PREFIX)) return value;
  const keyHex = await getOrCreateKey();
  const keyWA = CryptoJS.enc.Hex.parse(keyHex);
  const inner = value.slice(ENC_PREFIX.length);

  // Format: enc:<32-char iv hex>:<base64 ciphertext>
  if (inner.length > 33 && inner[32] === ":") {
    const ivHex = inner.slice(0, 32);
    const ciphertext = inner.slice(33);
    const ivBytes = new Uint8Array(
      (ivHex.match(/.{2}/g) ?? []).map((h) => parseInt(h, 16))
    );
    const ivWA = toWordArray(ivBytes);
    const bytes = CryptoJS.AES.decrypt(ciphertext, keyWA, { iv: ivWA });
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Legacy fallback: no explicit IV (passphrase-based format, pre-fix)
  const bytes = CryptoJS.AES.decrypt(inner, keyHex);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function encryptNullable(value: string | null): Promise<string | null> {
  if (value == null || value === "") return value;
  return encrypt(value);
}

export async function decryptNullable(value: string | null): Promise<string | null> {
  if (value == null || value === "") return value;
  return decrypt(value);
}
