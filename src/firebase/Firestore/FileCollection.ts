import { collection, where, addDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query } from "firebase/firestore";
import { FileI } from "../../interfaces/FileI";
import firestore from "../firestore";

const FilesCollection = collection(firestore, 'files');
export const addFile = (file: FileI) => {
    return getFiles(1, [where("title", '==', file.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(FilesCollection, file);
        });
}

export const getFiles = (
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
    return getDocs(query(FilesCollection, ...transactionsConstraints));
};
