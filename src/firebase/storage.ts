import { connectStorageEmulator, deleteObject, getStorage, ref, uploadBytes, UploadMetadata, getDownloadURL } from "firebase/storage";
import firebaseConfigApp from "./configApp";

const storage = getStorage(firebaseConfigApp);

if (process.env.NODE_ENV === "development") {
    connectStorageEmulator(storage, 'localhost', 9199);
}

export const uploadPhotoAndGetUrl = (name: string, location: string, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata | undefined) => {
    const storageRef = ref(storage, `${location}/${name}`);
    return uploadBytes(storageRef, data, metadata).then(result => getDownloadURL(result.ref));
}

export const deletePhoto = (name: string, location: string) => {
    const storageRef = ref(storage, `${location}/${name}`);
    return deleteObject(storageRef)
}
