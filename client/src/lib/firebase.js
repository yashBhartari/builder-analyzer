import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw-7sv3J1O3-6ncX3ymkTurB3Kij5OqzA",
  authDomain: "builder-2b5fa.firebaseapp.com",
  projectId: "builder-2b5fa",
  storageBucket: "builder-2b5fa.firebasestorage.app",
  messagingSenderId: "499095449699",
  appId: "1:499095449699:web:d7a657d64a7ae6bec50856",
  measurementId: "G-6HRPV4HRSY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// export const analytics = getAnalytics(app); // Optional if you need analytics in the future
