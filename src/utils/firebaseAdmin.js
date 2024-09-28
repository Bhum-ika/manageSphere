// utils/firebaseAdmin.js

import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import { db } from './firebase.js';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

// Load environment variables from .env file
dotenv.config();

// Retrieve and parse the service account key from environment variables
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

try {
  // Parse the JSON service account key
  const serviceAccount = JSON.parse(serviceAccountKey);

  // Initialize the Firebase Admin SDK if it hasn't been initialized yet
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'your-app-id.appspot.com', // Optional if you use Firebase Storage
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

// Function to check if Firebase Admin is initialized
export function isFirebaseAdminInitialized() {
  return admin.apps.length > 0;
}



// export async function deleteUser(uid) {
//   try {
//     // Delete user from Firebase Authentication
//     await admin.auth().deleteUser(uid);

//     // Optionally, delete user's data from Firestore and Storage
//     const db = admin.firestore();
//     const bucket = admin.storage().bucket();

//     // Delete user's Firestore document
//     await db.collection('users').doc(uid).delete();

//     // Delete user's files from Firebase Storage
//     const [files] = await bucket.getFiles({ prefix: `user-uploads/${uid}/` });
//     for (const file of files) {
//       await file.delete();
//     }

//     console.log(`User ${uid} deleted successfully.`);
//   } catch (error) {
//     console.error('Error deleting user:', error);
//   }
// }


export { admin };