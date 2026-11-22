/**
 * Firebase Integration Stub & Service Layer for BloodLink
 * 
 * To connect a live Firebase project in the future:
 * 1. Install firebase: npm install firebase
 * 2. Fill in your project credentials in the firebaseConfig object below.
 * 3. Replace the local storage mock calls with collection(db, "blood_requests")
 *    and signInWithEmailAndPassword(auth, email, password).
 */

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "bloodlink-prod.firebaseapp.com",
  projectId: "bloodlink-prod",
  storageBucket: "bloodlink-prod.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Architecture ready for Firestore collections:
// - /users/{userId} -> profile, role, bloodGroup, availability
// - /blood_requests/{requestId} -> patient, hospital, units, priority, status
// - /donations/{donationId} -> donorId, requestId, hospital, date, units
// - /notifications/{notificationId} -> recipientId, type, message, read

export const isFirebaseConfigured = false;
