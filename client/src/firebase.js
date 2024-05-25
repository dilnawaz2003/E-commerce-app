import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXnwELG_Li8bKRadepkcUcn3nW36y0WXo",
  authDomain: "mern-ecommerce-9bf0d.firebaseapp.com",
  projectId: "mern-ecommerce-9bf0d",
  storageBucket: "mern-ecommerce-9bf0d.appspot.com",
  messagingSenderId: "74417385688",
  appId: "1:74417385688:web:6d0a870be7db58126a67ad",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
