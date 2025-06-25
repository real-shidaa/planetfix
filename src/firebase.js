// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGOkq7wcGFDeSu9kvf6hRDpLBDG5ivds0",
  authDomain: "planetfix-b9305.firebaseapp.com",
  projectId: "planetfix-b9305",
  storageBucket: "planetfix-b9305.firebasestorage.app",
  messagingSenderId: "946802210844",
  appId: "1:946802210844:web:33fce736743565fba887d9",
  measurementId: "G-QT98LJ1N9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
export default app;