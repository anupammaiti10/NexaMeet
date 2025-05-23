import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey:"AIzaSyAs13kVP1_BwiqmTRSaGS760qZiEuCtP_Y",
  authDomain: "zoomapp-3b7d1.firebaseapp.com",
  projectId: "zoomapp-3b7d1",
  storageBucket: "zoomapp-3b7d1.firebasestorage.app",
  messagingSenderId: "1010365993666",
  appId: 
  "1:1010365993666:web:7d9a01e3f68fcf8942615b",
  measurementId: "G-LVK2ZDZVTW",
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
