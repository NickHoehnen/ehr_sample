import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBrkeSqaCVOQ0i5uJv8aNbjCUdRXw1kW4w",
  authDomain: "ehr-sample.firebaseapp.com",
  projectId: "ehr-sample",
  storageBucket: "ehr-sample.firebasestorage.app",
  messagingSenderId: "1052879038542",
  appId: "1:1052879038542:web:d0b0a9437198e254f37b1f",
  measurementId: "G-8MN9KRNQP8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Only initialize analytics in browser
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;