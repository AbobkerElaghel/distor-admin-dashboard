import { UploadMetadata, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../storage";

const uploadFileAndGetUrl = (name: string, category: string, file: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata | undefined) => {
    const storageRef = ref(storage, `${category}/${name}`);
    return uploadBytes(storageRef, file, metadata).then(result => getDownloadURL(result.ref));
}

export default uploadFileAndGetUrl;