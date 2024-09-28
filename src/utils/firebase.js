// // firebase.js
 import firebase from 'firebase/compat/app';
 import 'firebase/compat/auth';
 import 'firebase/compat/firestore';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyD_6aFdHlwAOp6NxqTzEFmHYbe5uScht14",
//     authDomain: "fir-zero-cb000.firebaseapp.com",
//     projectId: "fir-zero-cb000",
//     storageBucket: "fir-zero-cb000.appspot.com",
//     messagingSenderId: "140693975671",
//     appId: "1:140693975671:web:9817fc3296ff3d3f36cc72"
//   };

// // Initialize Firebase
// const firebaseApp =firebase.initializeApp(firebaseConfig);

// // Use these for db & auth
// const db = firebaseApp.firestore();
// const auth = firebase.auth();

// export { auth, db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWuOddtqmyRn8oZX7ltRoCrwjBi7M30sg",
  authDomain: "managepro-one.firebaseapp.com",
  projectId: "managepro-one",
  storageBucket: "managepro-one.appspot.com",
  messagingSenderId: "505967099250",
  appId: "1:505967099250:web:78ea6c95695d69e4e631eb",
  measurementId: "G-TKF7ZWCPG0"
};

// Initialize Firebase
const firebaseApp =firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = firebaseApp.firestore();
 const auth = firebase.auth();

 export { auth, db };