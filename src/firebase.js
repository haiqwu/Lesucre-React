import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "lesucre-a87e7.firebaseapp.com",
  projectId: "lesucre-a87e7",
  storageBucket: "lesucre-a87e7.appspot.com",
  messagingSenderId: "376355276190",
  appId: "1:376355276190:web:4091513853d9828ef1428f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig); //  if (!firebase.apps.length) { //this line of code in  }

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
