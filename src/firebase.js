import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
} from 'firebase/firestore';

import { useState } from 'react';
require('dotenv').config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
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


