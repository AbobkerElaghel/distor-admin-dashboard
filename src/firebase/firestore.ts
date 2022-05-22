import firebaseConfigApp from './configApp';
import { connectFirestoreEmulator, getFirestore, addDoc, collection, getDocs, QueryDocumentSnapshot, DocumentData, limit, orderBy, query, QueryConstraint, startAfter, where, getDoc, doc, updateDoc } from 'firebase/firestore'
import { FileCategoryI } from '../interfaces/FileCategoryI';

const firestore = getFirestore(firebaseConfigApp);

if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
}

export default firestore;