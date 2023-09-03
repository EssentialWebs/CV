// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 
const firebaseConfig = {
  apiKey: "AIzaSyC7dNLyfRR0uPWSUhNUyK4VKq75tjTckKY",
  authDomain: "pato-cv.firebaseapp.com",
  projectId: "pato-cv",
  storageBucket: "pato-cv.appspot.com",
  messagingSenderId: "704259895722",
  appId: "1:704259895722:web:1f6a227a84b8a9d4797bd3",
  measurementId: "G-L29J7J0RSP"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

