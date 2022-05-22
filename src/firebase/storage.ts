import { connectStorageEmulator, deleteObject, getStorage, ref, uploadBytes, UploadMetadata, getDownloadURL } from "firebase/storage";
import firebaseConfigApp from "./configApp";

const storage = getStorage(firebaseConfigApp);

if (process.env.NODE_ENV === "development") {
    connectStorageEmulator(storage, 'localhost', 9199);
}

export default storage;