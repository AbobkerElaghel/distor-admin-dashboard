import { collection, where, addDoc, getDoc, doc, updateDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query, deleteDoc } from "firebase/firestore";
import firestore from '../firestore';
import deletePhoto from "../Storage/deletePhoto";
const CollectionName = 'founders';
const FoundersCollection = collection(firestore, CollectionName);
const FounderDoc = (id: string) => doc(firestore, CollectionName, id);

export const addFounders = (founder: any) => {
    return getFounders(1, [where("title", '==', founder.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(FoundersCollection, founder);
        });
};

export const getSingleFounder = (id: string) => {
    return getDoc(FounderDoc(id));
};

export const updateFounder = (id: string, founder: any) => {
    return updateDoc(FounderDoc(id), founder);
};

export const getFounders = (
    queryLimit: number = 1000,
    queryConstraint: QueryConstraint[] = [],
    curser?: QueryDocumentSnapshot<DocumentData>,
) => {
    const transactionsConstraints = [
        limit(queryLimit),
        orderBy("date", "desc"),
        ...queryConstraint
    ];
    if (curser) {
        transactionsConstraints.push(startAfter(curser));
    }
    return getDocs(query(FoundersCollection, ...transactionsConstraints));
};

export const deleteFounder = (id: string) => {
    return deleteDoc(FounderDoc(id)).then(() => {
        return deletePhoto(id, 'Founders');
    });
};
