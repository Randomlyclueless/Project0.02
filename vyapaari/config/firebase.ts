// config/firebase.ts
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAlMQ-CUk_uM-5BtMkmkvhjiQxiCeSJI3Y',
    authDomain: 'vyapaari-e9ba1.firebaseapp.com',
    projectId: 'vyapaari-e9ba1',
    storageBucket: 'vyapaari-e9ba1.appspot.com',
    messagingSenderId: '483367120647',
    appId: '1:483367120647:web:3049d9232ce5b7d8921fa2',
};

let app: FirebaseApp;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);

export { auth };
