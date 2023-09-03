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
  apiKey: "AIzaSyB9XtwaMX6GXCickWsRdFj9SWn-23ENIXI",
  authDomain: "streaming-front-95aa5.firebaseapp.com",
  databaseURL: "https://streaming-front-95aa5-default-rtdb.firebaseio.com",
  projectId: "streaming-front-95aa5",
  storageBucket: "streaming-front-95aa5.appspot.com",
  messagingSenderId: "5178548171",
  appId: "1:5178548171:web:71ee8d4631a61ec68ce04e",
  measurementId: "G-T08PGP9CRX"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

