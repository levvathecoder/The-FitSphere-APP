import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// --- THIS IS THE FIX ---
// Import all persistence types
import {
    getReactNativePersistence, // For Native
    indexedDBLocalPersistence // For Web
    ,
    initializeAuth
} from "firebase/auth";
// --- END FIX ---

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// YOUR WEB APP'S FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyCw-GK4y4vrdGNmfYuWY9s-XyIjBB2VMdk",
  authDomain: "fitnesssuperapp-b77ae.firebaseapp.com",
  projectId: "fitnesssuperapp-b77ae",
  storageBucket: "fitnesssuperapp-b77ae.firebasestorage.app",
  messagingSenderId: "663653060277",
  appId: "1:663653060277:web:061a1402382a029d82f8fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- PLATFORM-AWARE AUTH ---
// Conditionally choose the persistence based on the platform
export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? indexedDBLocalPersistence   // Use this for web
    : getReactNativePersistence(ReactNativeAsyncStorage) // Use this for native
});
// --- END PLATFORM-AWARE AUTH ---

// Initialize other Firebase services
export const db = getFirestore(app);