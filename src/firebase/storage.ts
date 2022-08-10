import { connectStorageEmulator, getStorage } from "firebase/storage";
import firebaseConfigApp from "./configApp";

const storage = getStorage(firebaseConfigApp);


export default storage;