import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";

export const firebaseConfig = {
	// apiKey: process.env.FIREBASE_API_KEY,
	// authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	// projectId: process.env.FIREBASE_PROJECT_ID,
	// storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	// messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	// appId: process.env.FIREBASE_APP_ID,
	// measurementId: process.env.FIREBASE_MEASUREMENT_ID,

	apiKey: "AIzaSyD5iLpuPjMjuIbcL0c-N6-mEDBIe2V7Y94",
	authDomain: "opbot-eaf96.firebaseapp.com",
	projectId: "opbot-eaf96",
	storageBucket: "opbot-eaf96.appspot.com",
	messagingSenderId: "359709125915",
	appId: "1:359709125915:web:080044314d45aaaa4d37be",
	measurementId: "G-Y3HJ361BSX",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
