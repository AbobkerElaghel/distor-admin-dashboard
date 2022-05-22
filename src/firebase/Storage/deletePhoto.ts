import { ref, deleteObject } from "firebase/storage";
import storage from "../storage";

const deletePhoto = (name: string, location: string) => {
    const storageRef = ref(storage, `${location}/${name}`);
    return deleteObject(storageRef)
}

export default deletePhoto;