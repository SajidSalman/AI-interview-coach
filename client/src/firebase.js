// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSy***************",  // Keep it private
  authDomain: "interviewproject-d2797.firebaseapp.com",
  projectId: "interviewproject-d2797",
  storageBucket: "interviewproject-d2797.appspot.com",
  messagingSenderId: "740025939629",
  appId: "1:740025939629:web:6ad5df7697714e5c067824"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Storage instance
const storage = getStorage(app);

export { storage };
