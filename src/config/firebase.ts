import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAquzxtRSPG8e6GToPqOHbYbPMKu_Ff20A",
  authDomain: "stemm-lab-app-aeb91.firebaseapp.com",
  projectId: "stemm-lab-app-aeb91",
  storageBucket: "stemm-lab-app-aeb91.firebasestorage.app",
  messagingSenderId: "1088798418289",
  appId: "1:1088798418289:web:c9caa3bdc6eef75161c2d0",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
