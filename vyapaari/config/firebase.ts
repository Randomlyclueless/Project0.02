// services/firebase.ts or config/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAlMQ-CUk_uM-5BtMkmkvhjiQxiCeSJI3Y',
  authDomain: 'vyapaari-e9ba1.firebaseapp.com',
  projectId: 'vyapaari-e9ba1',
  storageBucket: 'vyapaari-e9ba1.appspot.com',
  messagingSenderId: '483367120647',
  appId: '1:483367120647:web:3049d9232ce5b7d8921fa2',
};

// ✅ Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export services safely
const auth = getAuth(app);
const db = getFirestore(app);        // Firestore
const rtdb = getDatabase(app);       // Realtime DB

export { auth, db, rtdb };
