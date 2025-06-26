// Tunggu hingga DOM siap
document.addEventListener("DOMContentLoaded", function () {
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDisplay = document.getElementById("login-error");

// Tangani submit form login
loginForm.addEventListener("submit", function (e) {
e.preventDefault();

const email = emailInput.value.trim();
const password = passwordInput.value;

// Validasi input
if (!email || !password) {
  errorDisplay.textContent = "Email dan password wajib diisi.";
  return;
}

// Proses login dengan Firebase Authentication
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Login berhasil
    const user = userCredential.user;
    console.log("Login berhasil:", user.email);
    errorDisplay.textContent = "";
    // Redirect ke dashboard admin
    window.location.href = "dashboard.html";
  })
  .catch((error) => {
    console.error("Gagal login:", error.message);
    errorDisplay.textContent = "Email atau password salah!";
  });

  });
});