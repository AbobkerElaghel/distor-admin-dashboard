import firebaseConfigApp from './configApp';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firestore = getFirestore(firebaseConfigApp);



export default firestore;