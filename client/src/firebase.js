/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'firebase/auth';
require('dotenv').config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDu36T0-xgUSa9-cOSukUZ_yce4o_BU2M4',
    authDomain: 'rechat-ab56a.firebaseapp.com',
    projectId: 'rechat-ab56a',
    storageBucket: 'rechat-ab56a.appspot.com',
    messagingSenderId: '378393254542',
    appId: '1:378393254542:web:e2044195803444d29f07df',
    measurementId: 'G-C530XH0ZQK',
};
initializeApp(firebaseConfig);

export const db = getFirestore();
export const colRef = collection(db, 'userDetails');
export const auth = getAuth();
export const RecaptchaVerifierFirebase = RecaptchaVerifier;
export const signInWithPno = signInWithPhoneNumber;
