import { collection, where, addDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query } from "firebase/firestore";
import { FileCategoryI } from "../../interfaces/FileCategoryI";
import firestore from "../firestore";

const FileCategoryCollection = collection(firestore, 'file_category');
export const addFileCategory = (fileCategory: FileCategoryI) => {
    return getFileCategories(1, [where("title", '==', fileCategory.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(FileCategoryCollection, fileCategory);
        });
}
export const getFileCategories = (
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
    return getDocs(query(FileCategoryCollection, ...transactionsConstraints));
};