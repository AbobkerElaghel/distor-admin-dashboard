import { collection, deleteDoc, doc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query } from "firebase/firestore";
import firestore from '../firestore';

const CollectionName = "signatures";
const SignaturesCollection = collection(firestore, CollectionName);
const SignaturesDoc = (id: string) => doc(firestore, CollectionName, id);

export const getSignaturesDocs = (
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
    return getDocs(query(SignaturesCollection, ...transactionsConstraints));
};

export const deleteSignature = (id: string) => {
    return deleteDoc(SignaturesDoc(id));
};
