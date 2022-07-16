import firebaseConfigApp from './configApp';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firestore = getFirestore(firebaseConfigApp);

if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(firestore, "localhost", 8090);
}

export default firestore;