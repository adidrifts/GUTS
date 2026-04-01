import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCdaGUkthO7kmS82f_N9x2wEElpVKflZVc",
    authDomain: "guts-gym.firebaseapp.com",
    projectId: "guts-gym",
    storageBucket: "guts-gym.firebasestorage.app",
    messagingSenderId: "891024838016",
    appId: "1:891024838016:web:3bb449cf5cd78b945b4565",
    measurementId: "G-DK2YP15HF8"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection };
