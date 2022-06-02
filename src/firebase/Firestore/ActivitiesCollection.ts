import { collection, where, addDoc, getDoc, doc, updateDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query } from "firebase/firestore";
import firestore from '../firestore';
const CollectionName = 'activities';
const ActivitiesCollection = collection(firestore, CollectionName);
const ActivitiesDoc = (id: string) => doc(firestore, CollectionName, id);

export const addActivities = (activity: any) => {
    return getActivities(1, [where("title", '==', activity.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(ActivitiesCollection, activity);
        });
}

export const getSingleActivity = (id: string) => {
    return getDoc(ActivitiesDoc(id));
};

export const updateActivity = (id: string, activity: any) => {
    return updateDoc(ActivitiesDoc(id), activity);
};

export const getActivities = (
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
    return getDocs(query(ActivitiesCollection, ...transactionsConstraints));
};