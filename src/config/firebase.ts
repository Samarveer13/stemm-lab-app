import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import EncryptedAsyncStorage from "../utils/secureFirebasePersistence";
import { firebaseConfig } from "./secrets";

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(EncryptedAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
