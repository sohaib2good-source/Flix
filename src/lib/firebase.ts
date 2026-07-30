import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "project-653a9838-bf91-44c4-bf5",
  appId: "1:387432308685:web:dba81656b333482076ae84",
  apiKey: "AIzaSyBvHO_Gtrryg0YUPAtSdC7NP8rD8Jha__4",
  authDomain: "project-653a9838-bf91-44c4-bf5.firebaseapp.com",
  storageBucket: "project-653a9838-bf91-44c4-bf5.firebasestorage.app",
  messagingSenderId: "387432308685",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
