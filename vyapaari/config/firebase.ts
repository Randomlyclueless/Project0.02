import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// ✅ Unified Firebase Project Config (Same for Auth + RTDB)
const firebaseConfig = {
  apiKey: "AIzaSyAlMQ-CUk_uM-5BtMkmkvhjiQxiCeSJI3Y",
  authDomain: "vyapaari-e9ba1.firebaseapp.com",
  databaseURL: "https://vyapaari-e9ba1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vyapaari-e9ba1",
  storageBucket: "vyapaari-e9ba1.appspot.com",
  messagingSenderId: "483367120647",
  appId: "1:483367120647:web:3049d9232ce5b7d8921fa2",
};

// ✅ Initialize app only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Export Auth & Realtime Database
const auth = getAuth(app);
const rtdb = getDatabase(app);

export { auth, rtdb };
