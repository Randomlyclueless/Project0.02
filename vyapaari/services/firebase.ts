// services/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// ✅ Your Firebase configuration (with corrected storageBucket)
const firebaseConfig = {
  apiKey: "AIzaSyCeSC-y1SdKnLj2Ghrc0jGiSCygMCXSLUk",
  authDomain: "vyapaari-bdc68.firebaseapp.com",
  databaseURL: "https://vyapaari-bdc68-default-rtdb.firebaseio.com",
  projectId: "vyapaari-bdc68",
  storageBucket: "vyapaari-bdc68.appspot.com", // ✅ corrected!
  messagingSenderId: "532526940602",
  appId: "1:532526940602:web:8866c39e84d739c97e9d83",
  measurementId: "G-3P8WCVPE57" // Optional, safe to keep but not used
};

// ✅ Initialize Firebase and export Realtime Database only
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
