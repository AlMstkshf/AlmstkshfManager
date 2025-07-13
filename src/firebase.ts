// Manually declare Vite environment variables to fix TypeScript errors.
declare global {
  interface ImportMeta {
    readonly env: {
      [key: string]: string;
      VITE_FIREBASE_API_KEY: string;
      VITE_FIREBASE_AUTH_DOMAIN: string;
      VITE_FIREBASE_PROJECT_ID: string;
      VITE_FIREBASE_STORAGE_BUCKET: string;
      VITE_FIREBASE_MESSAGING_SENDER_ID: string;
      VITE_FIREBASE_APP_ID: string;
    }
  }
}

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'us-central1');
const storage = getStorage(app);

// Typed Cloud Functions
const signUpUser = httpsCallable(functions, 'signUpUser');
const adminInviteUser = httpsCallable(functions, 'adminInviteUser');
const completeInvitedUserSetup = httpsCallable(functions, 'completeInvitedUserSetup');
const deleteUserByAdmin = httpsCallable(functions, 'deleteUserByAdmin');

// AI Proxy Functions
const generateProjectIdeas = httpsCallable(functions, 'generateProjectIdeas');
const analyzeTaskComment = httpsCallable(functions, 'analyzeTaskComment');
const generateMeetingAgenda = httpsCallable(functions, 'generateMeetingAgenda');
const generateProjectInsights = httpsCallable(functions, 'generateProjectInsights');


export { 
    auth, db, storage, functions, 
    signUpUser, adminInviteUser, completeInvitedUserSetup, deleteUserByAdmin,
    generateProjectIdeas, analyzeTaskComment, generateMeetingAgenda, generateProjectInsights
};