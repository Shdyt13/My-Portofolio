import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Firebase Config (copy dari firebase-config.js atau sesuaikan)
const firebaseConfig = {
  apiKey: "AIzaSyBnPysAHewJAo6dZsQ7c3Llq5HHev423OM",
  authDomain: "portofolio-sapar-fb224.firebaseapp.com",
  projectId: "portofolio-sapar-fb224",
  storageBucket: "portofolio-sapar-fb224.appspot.com",
  messagingSenderId: "715228360811",
  appId: "1:715228360811:web:87a62c2c6524b9ffd9c12e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "admin.html"; // ✅ redirect berhasil
      })
      .catch((error) => {
        console.error("Login gagal:", error.message);
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "Email atau password salah.";
      });
  });
});
