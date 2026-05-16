import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCnUagj3MOPYvZpa2PomKnCdBIUawqrzS4",
  authDomain: "made-invitation.firebaseapp.com",
  projectId: "made-invitation",
  storageBucket: "made-invitation.firebasestorage.app",
  messagingSenderId: "431773043452",
  appId: "1:431773043452:web:3cc98050d67c5af8722579",
  measurementId: "G-DD27HG5X0H",
  databaseURL: "https://made-invitation-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);
