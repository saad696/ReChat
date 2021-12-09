import { addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { colRef, db } from '../firebase';

export const storeDataToDB = (data) => {
    let _existingData = [];
    getDocs(colRef)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                _existingData.push({ ...doc.data(), id: doc.id });
            });
            addOrUpdate(_existingData, data);
        })
        .catch((err) => {
            if (err) {
                console.log('Some error ocurred!');
            }
        });

    const addOrUpdate = (dbData, data) => {
        let doesExist = false

        for (let d of dbData) {
            if (d.userId && d.userId === data.userId) {
                doesExist = true;
            } else {
                doesExist = false;
            }
        }

        for (let d of dbData) {
            if (doesExist) {
                const docRef = doc(db, 'userDetails', d.id);
                updateDoc(docRef, {
                    visited: d.visited + 1,
                });
            }
        }

        if (doesExist === false) {
            addDoc(colRef, { ...data });
        }
    };
};
