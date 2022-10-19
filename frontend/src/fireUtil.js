/** @format */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: 'sweet-corner-shop.firebaseapp.com',
	databaseURL: 'https://sweet-corner-shop-default-rtdb.firebaseio.com',
	projectId: 'sweet-corner-shop',
	storageBucket: 'sweet-corner-shop.appspot.com',
	messagingSenderId: '369614338288',
	appId: process.env.APP_ID,
	measurementId: 'G-781E8EG8D9'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
