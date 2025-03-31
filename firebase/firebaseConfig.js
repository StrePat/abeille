// firebase/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFmhOlXLN38jStC9Z0CW9Bhxjo19yDI1Y",
  authDomain: "abeille-taches.firebaseapp.com",
  projectId: "abeille-taches",
  storageBucket: "abeille-taches.appspot.com",
  messagingSenderId: "976348714441",
  appId: "1:976348714441:web:d9a8b5659374a32760c418"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => console.log("✅ Connecté anonymement à Firebase"))
  .catch((error) => console.error("❌ Erreur de connexion Firebase:", error));

console.log("✅ Firebase initialisé, Firestore chargé :", db);

export { db, auth };