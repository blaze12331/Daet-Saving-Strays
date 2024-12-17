// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZwu0EU7P2wN3_diah90VAUgtgNK0TP5Y",
  authDomain: "daet-saving-strays.firebaseapp.com",
  projectId: "daet-saving-strays",
  storageBucket: "daet-saving-strays.appspot.app",
  messagingSenderId: "680162784902",
  appId: "1:680162784902:web:06f19a8e292fa2aadd4307",
  measurementId: "G-EEVFEWBFCH",
  databaseURL: "https://daet-saving-strays-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);

console.log("Firebase initialized successfully");
