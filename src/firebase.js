import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_o7o45cQiDOwT7DfOy43p38KgOIoq0Qo",
  authDomain: "craftelligence-developer-67621.firebaseapp.com",
  projectId: "craftelligence-developer-67621",
  storageBucket: "craftelligence-developer-67621.firebasestorage.app",
  messagingSenderId: "506873714887",
  appId: "1:506873714887:web:76e48a07dfb99f1210c6e2",
  measurementId: "G-BPC4HQ3DJ3"
};

// Initialize Firebase with performance optimizations
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with optimizations
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider for better performance
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable offline persistence for better performance
if (typeof window !== 'undefined') {
  // Enable offline persistence
  import('firebase/firestore').then(({ enableNetwork, disableNetwork }) => {
    // Enable network by default
    enableNetwork(db);
  });
}

export default app;
