import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
import { getFirebase } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBMQt2Vm7UdmRfdeH4UzNNRuHngoy2yQho",
  authDomain: "flashcard-ai-582b6.firebaseapp.com",
  projectId: "flashcard-ai-582b6",
  storageBucket: "flashcard-ai-582b6.appspot.com",
  messagingSenderId: "1089882204483",
  appId: "1:1089882204483:web:a517e1ed660042a041e7f6"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export {db};

