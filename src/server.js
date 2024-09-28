import express from "express";
import cors from "cors";
import {
  admin,
  isFirebaseAdminInitialized

} from "./utils/firebaseAdmin.js"; // Adjust the path as needed
import { getDoc, updateDoc } from "firebase/firestore";
import { auth } from "./utils/firebase.js";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
app.post('/create-user', async (req, res) => {
  const {eCode, name, email, password, address, roles } = req.body;

  
  try {
    if (isFirebaseAdminInitialized()){
    const userRecord = await admin.auth().createUser({
      eCode, name, email, password, address, roles
    });

    // Set custom user claims (optional)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'user' });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      eCode, name, email, password, address, roles
    });

    res.status(201).json({ uid: userRecord.uid });
  }
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ error: error.message });
  }
});



app.delete("/delete-user/:uid", async (req, res) => {
  const { uid } = req.params;
console.log("delete")
  try {
    if (isFirebaseAdminInitialized()) {
      // Delete user from Firebase Authentication
      await admin.auth().deleteUser(uid);

      // Delete associated Firestore documents
      const userDocRef = admin.firestore().doc(`users/${uid}`);
      await userDocRef.delete();

      // Optionally delete other related documents or subcollections
      const accessiblePagesRef = admin
        .firestore()
        .collection(`users/${uid}/accessiblePages`);
      const pagesSnapshot = await accessiblePagesRef.get();
      const deletePromises = pagesSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deletePromises);

      res
        .status(200)
        .send({
          message: `User ${uid} and associated data deleted successfully`,
        });
    } else {
      res.status(500).send({ error: "Firebase Admin SDK not initialized" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/api/editUser/:uid', async (req, res) => {
  const { uid } = req.params;
  const { displayName, email, password, address } = req.body;

  try {
    if (isFirebaseAdminInitialized()) {
      // Prepare the update data for Firebase Authentication
      const authUpdateData = {};
      if (displayName) authUpdateData.displayName = displayName;
      if (email) authUpdateData.email = email;
      if (password) authUpdateData.password = password;

      // Update Firebase Authentication user
      const userRecord = await admin.auth().updateUser(uid, authUpdateData);

      // Update Firestore document
      const db = admin.firestore();
      await db.collection('users').doc(uid).update({
        displayName: displayName || admin.auth().getUser(uid).then(user => user.displayName),
        address: address || admin.auth().getUser(uid).then(user => user.address),
      });

      res.json({ message: 'User updated successfully', userRecord });
    } else {
      res.status(500).send({ error: 'Firebase Admin SDK not initialized' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ error: error.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
