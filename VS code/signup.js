import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();  

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const batch = document.getElementById('batch').value;

    console.log({ name, email, password, batch });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'alumni', user.uid), {
        name,
        email,
        batch,
        job: "",
        location: ""
      });

      alert('Signup successful!');
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error: ' + error.message);
    }
  });
});
