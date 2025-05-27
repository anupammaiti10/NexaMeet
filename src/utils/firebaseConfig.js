import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_NEXAMEET_APP_FIREBASE_API_KEY,
  authDomain:  import.meta.env.VITE_NEXAMEET_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_NEXAMEET_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_NEXAMEET_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_NEXAMEET_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: 
  import.meta.env.VITE_NEXAMEET_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_NEXAMEET_APP_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);
// Initialize Firestore
// const db = getFirestore(app);
// A reference to the Firestore users collection
export const usersRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");
