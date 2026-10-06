import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEEhrgyQ7ThLHGwRMPceIm7kGlq7zHgjM",
  authDomain: "alumni-management-e16f1.firebaseapp.com",
  projectId: "alumni-management-e16f1",
  storageBucket: "alumni-management-e16f1.appspot.com",
  messagingSenderId: "93738401503",
  appId: "1:93738401503:web:6c0fd441c773400822336a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };