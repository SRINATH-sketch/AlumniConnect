import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtTcFxFJR5HJLjukwN0hGilVI5qjlSjl8",
  authDomain: "alumni-managementvs2.firebaseapp.com",
  projectId: "alumni-managementvs2",
  storageBucket: "alumni-managementvs2.firebasestorage.app",
  messagingSenderId: "234881180114",
  appId: "1:234881180114:web:13935dfbddc9b5a02ba80b",
  measurementId: "G-WVVZYCRGGX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const selectedUserType = document.getElementById("userType").value;

        if (!selectedUserType) {
            alert("Please select your role (Student / Alumni / Administrator)");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const actualType = userData.userType || userData.interests?.userType;

                // Check for type mismatch
                if (actualType.toLowerCase() !== selectedUserType.toLowerCase()) {
                    await signOut(auth);
                    alert(`This account is registered as ${actualType}, not ${selectedUserType}.`);
                    return;
                }

                // Store in session
                sessionStorage.setItem("userType", actualType);
                sessionStorage.setItem("userName", userData.fullName);
                sessionStorage.setItem("userEmail", userData.email);
                sessionStorage.setItem("userId", user.uid);

                alert("Login successful!");

                // Role-based redirection
                const userTypeLower = actualType.toLowerCase();
                if (userTypeLower === "student") {
                    window.location.href = "student-dashboard.html";
                } else if (userTypeLower === "alumni") {
                    window.location.href = "alumni-dashboard.html";
                } else if (userTypeLower === "administrator" || userTypeLower === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            } else {
                await signOut(auth);
                alert("User data not found. Please contact administrator.");
            }
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                alert("Invalid email or password.");
            } else {
                alert("Login failed: " + error.message);
            }
        }
    });
}