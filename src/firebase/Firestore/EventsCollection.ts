import { collection, where, addDoc, getDoc, doc, updateDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query, deleteDoc } from "firebase/firestore";
import firestore from '../firestore';
import deletePhoto from "../Storage/deletePhoto";
const CollectionName = 'events';
const EventsCollection = collection(firestore, CollectionName);
const EventDoc = (id: string) => doc(firestore, CollectionName, id);

export const addEvents = (event: any) => {
    return getEvents(1, [where("title", '==', event.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(EventsCollection, event);
        });
};

export const getSingleEvent = (id: string) => {
    return getDoc(EventDoc(id));
};

export const updateEvent = (id: string, event: any) => {
    return updateDoc(EventDoc(id), event);
};

export const getEvents = (
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
    return getDocs(query(EventsCollection, ...transactionsConstraints));
};

export const deleteEvent = (id: string) => {
    return deleteDoc(EventDoc(id)).then(() => {
        return deletePhoto(id, 'Events');
    });
};
