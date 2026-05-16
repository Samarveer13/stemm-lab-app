/**
 * Encrypted AsyncStorage adapter for Firebase Auth persistence.
 *
 * Firebase tokens are stored in AsyncStorage encrypted with AES-256.
 * The encryption key lives in SecureStore (iOS Keychain / Android Keystore).
 * This means raw AsyncStorage contents are unreadable without the device key.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encrypt, decrypt } from "./encryption";

const EncryptedAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    return decrypt(raw);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    const encrypted = await encrypt(value);
    await AsyncStorage.setItem(key, encrypted);
  },

  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

export default EncryptedAsyncStorage;
