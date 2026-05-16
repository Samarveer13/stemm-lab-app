import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY_ALIAS = "stemm_lab_enc_key";
const ENC_PREFIX = "enc:";

let cachedKey: string | null = null;

async function getOrCreateKey(): Promise<string> {
  if (cachedKey) return cachedKey;

  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_ALIAS);
  if (!key) {
    key = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, key);
  }

  cachedKey = key;
  return key;
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await getOrCreateKey();
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
  return `${ENC_PREFIX}${ciphertext}`;
}

/**
 * Decrypts a value produced by `encrypt`. Plaintext values (no prefix) are
 * returned as-is so legacy unencrypted rows degrade gracefully.
 */
export async function decrypt(value: string): Promise<string> {
  if (!value.startsWith(ENC_PREFIX)) return value;
  const key = await getOrCreateKey();
  const ciphertext = value.slice(ENC_PREFIX.length);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/** Encrypt only when the value is non-null/non-empty. */
export async function encryptNullable(value: string | null): Promise<string | null> {
  if (value == null || value === "") return value;
  return encrypt(value);
}

export async function decryptNullable(value: string | null): Promise<string | null> {
  if (value == null || value === "") return value;
  return decrypt(value);
}
