import { collection, where, addDoc, getDoc, doc, updateDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query, deleteDoc } from "firebase/firestore";
import firestore from '../firestore';
import deletePhoto from "../Storage/deletePhoto";
const CollectionName = 'qas';
const QAsCollection = collection(firestore, CollectionName);
const QADoc = (id: string) => doc(firestore, CollectionName, id);

export const addQAs = (qa: any) => {
    return getQAs(1, [where("q", '==', qa.q)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(QAsCollection, qa);
        });
}

export const getSingleQA = (id: string) => {
    return getDoc(QADoc(id));
};

export const updateQA = (id: string, qa: any) => {
    return updateDoc(QADoc(id), qa);
};

export const getQAs = (
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
    return getDocs(query(QAsCollection, ...transactionsConstraints));
};

export const deleteQA = (id: string) => {
    return deleteDoc(QADoc(id));
};
