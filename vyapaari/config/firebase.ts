import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// ✅ Auth from vyapaari-e9ba1
const authConfig = {
  apiKey: "AIzaSyAlMQ-CUk_uM-5BtMkmkvhjiQxiCeSJI3Y",
  authDomain: "vyapaari-e9ba1.firebaseapp.com",
  projectId: "vyapaari-e9ba1",
  storageBucket: "vyapaari-e9ba1.appspot.com",
  messagingSenderId: "483367120647",
  appId: "1:483367120647:web:3049d9232ce5b7d8921fa2",
};

// ✅ Realtime DB from vyapaari-bdc68
const dbConfig = {
  apiKey: "AIzaSyCeSC-y1SdKnLj2Ghrc0jGiSCygMCXSLUk",
  authDomain: "vyapaari-bdc68.firebaseapp.com",
  databaseURL: "https://vyapaari-bdc68-default-rtdb.firebaseio.com",
  projectId: "vyapaari-bdc68",
  storageBucket: "vyapaari-bdc68.appspot.com",
  messagingSenderId: "532526940602",
  appId: "1:532526940602:web:453ff54ac16f11197e9d83",
};

// Initialize auth app
const appAuth = getApps().find(app => app.name === "[DEFAULT]") || initializeApp(authConfig);
const auth = getAuth(appAuth);

// Initialize DB app (as a second named app)
const appDB = getApps().find(app => app.name === "DB_APP") || initializeApp(dbConfig, "DB_APP");
const db = getDatabase(appDB);

export { auth, db };
