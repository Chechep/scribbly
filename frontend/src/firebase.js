// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAPKXX0jSsPOVhjDlg8mUzL1muZE1Thck8",
    authDomain: "scribbly-88d77.firebaseapp.com",
    projectId: "scribbly-88d77",
    storageBucket: "scribbly-88d77.firebasestorage.app",
    messagingSenderId: "886338472109",
    appId: "1:886338472109:web:5ddc46431bd3c3723e5e24",
    measurementId: "G-900C3DZGPG"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
