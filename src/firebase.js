// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB02gaemFAmS7U2Nm0sCsIyMWA6Awn1sG4",
  authDomain: "events-booking-system.firebaseapp.com",
  projectId: "events-booking-system",
  storageBucket: "events-booking-system.firebasestorage.app",
  messagingSenderId: "478360105876",
  appId: "1:478360105876:web:06ed4d5a6e4844afcb9581"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

