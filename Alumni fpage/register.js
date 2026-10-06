import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

console.log("✅ Firebase initialized");

const registerForm = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");

if (!registerForm) {
    console.error("❌ registerForm not found!");
} else {
    console.log("✅ registerForm found");
    
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        console.log("📝 Form submitted");
        
        // Disable button to prevent double submission
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Registering...";
        }
        
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const userType = document.getElementById("userType").value;

        console.log("Form data:", { fullName, email, userType, passwordLength: password.length });

        // Validate inputs
        if (!fullName) {
            alert("Please enter your full name");
            resetButton();
            return;
        }

        if (!email) {
            alert("Please enter your email");
            resetButton();
            return;
        }

        if (!userType) {
            alert("Please select your role");
            resetButton();
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            resetButton();
            return;
        }

        try {
            console.log("🔄 Creating user in Firebase Auth...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("✅ User created in Auth:", user.uid);

            // Prepare user data
            const userData = {
                fullName: fullName,
                email: email,
                userType: userType,
                createdAt: new Date().toISOString(),
                status: "active"
            };

            // Add role-specific fields
            if (userType === 'student') {
                userData.department = '';
                userData.year = '';
                userData.interests = [];
                userData.connections = [];
            } else if (userType === 'alumni') {
                userData.graduationYear = '';
                userData.company = '';
                userData.position = '';
                userData.skills = [];
                userData.availableForMentorship = true;
            }

            console.log("🔄 Saving to Firestore...", userData);
            
            await setDoc(doc(db, "users", user.uid), userData);
            
            console.log("✅ Data saved to Firestore!");
            alert("Registration successful! You can now login.");
            window.location.href = "login.html";
            
        } catch (error) {
            console.error("❌ Error:", error.code, error.message);
            
            let errorMessage = "Registration failed: ";
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already registered. Please login instead.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password should be at least 6 characters long.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address.";
                    break;
                case 'permission-denied':
                    errorMessage = "Database permission denied. Please check Firestore rules.";
                    break;
                default:
                    errorMessage += error.message;
            }
            
            alert(errorMessage);
            resetButton();
        }
    });
}

function resetButton() {
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
    }
}