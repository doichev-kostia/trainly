import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_GCP_PROJECT_ID,
	PUBLIC_GCP_STORAGE_BUCKET,
} from "$env/static/public";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_GCP_PROJECT_ID,
	storageBucket: PUBLIC_GCP_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp = {} as FirebaseApp;

// the app could be created many times during navigation
if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
}

const firebaseAuth = getAuth(firebaseApp);

export { firebaseAuth, firebaseApp };
