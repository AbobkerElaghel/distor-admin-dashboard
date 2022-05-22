import { UploadMetadata, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../storage";

const uploadPhotoAndGetUrl = (name: string, location: string, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata | undefined) => {
    const storageRef = ref(storage, `${location}/${name}`);
    return uploadBytes(storageRef, data, metadata).then(result => getDownloadURL(result.ref));
}

export default uploadPhotoAndGetUrl;