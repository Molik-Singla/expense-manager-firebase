import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCn1JKCP1_GprtE4Edylnbp9S1SR9YXUcI",
    authDomain: "expense-tracker-721ec.firebaseapp.com",
    projectId: "expense-tracker-721ec",
    storageBucket: "expense-tracker-721ec.appspot.com",
    messagingSenderId: "902937504812",
    appId: "1:902937504812:web:8e2764c1508c1cb1c8f589",
    measurementId: "G-C5KCX2NP5C",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firebaseStore = getFirestore(app);

export { firebaseAuth, firebaseStore };
