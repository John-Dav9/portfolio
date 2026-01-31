import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH-74L5o7JJMhr9Mv_8gAUajXt8jZMawU",
  authDomain: "john-david-portfolio.firebaseapp.com",
  projectId: "john-david-portfolio",
  storageBucket: "john-david-portfolio.firebasestorage.app",
  messagingSenderId: "43806729678",
  appId: "1:43806729678:web:3d210a75967736e91d379f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);
