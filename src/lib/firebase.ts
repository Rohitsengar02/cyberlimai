import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOqsOPFJoUBUWm6Lkj1ANPbLcTNiCgbiY",
  authDomain: "dream-deploy.firebaseapp.com",
  projectId: "dream-deploy",
  storageBucket: "dream-deploy.firebasestorage.app",
  messagingSenderId: "119784140189",
  appId: "1:119784140189:web:39cb85704bd312df39d374",
  measurementId: "G-86ZS8CEGMP"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
