// You can access Firebase data directly from the dashboard, as per your
// security rules using this object. Just populate your projects configuration.

import { initializeApp, firestore } from "firebase";

// Set your Firebase config here. You can copy this whole block from Firebase
// dashboard at https://console.firebase.google.com.
const config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  databaseURL: "https://YOUR_APP.firebaseio.com",
  projectId: "YOUR_APP",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "YOUR_APP_MESSENGER_ID"
};
initializeApp(config);

const db = firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

export default db;
