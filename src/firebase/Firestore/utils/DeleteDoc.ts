import { doc, deleteDoc } from 'firebase/firestore';
import deletePhoto from '../../Storage/deletePhoto';
import firestore from '../../firestore';

export const deleteFirestoreDocument = (id: string, CollectionName: string) => {
    return deleteDoc(doc(firestore, CollectionName, id)).then(() => {
        return deletePhoto(id, CollectionName);
    });
};