// public/js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBnPysAHewJAo6dZsQ7c3Llq5HHev423OM",
  authDomain: "portofolio-sapar-fb224.firebaseapp.com",
  projectId: "portofolio-sapar-fb224",
  storageBucket: "portofolio-sapar-fb224.appspot.com",
  messagingSenderId: "715228360811",
  appId: "1:715228360811:web:87a62c2c6524b9ffd9c12e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
