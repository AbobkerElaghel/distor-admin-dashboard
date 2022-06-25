import { collection, where, addDoc, getDoc, doc, updateDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query, deleteDoc } from "firebase/firestore";
import firestore from '../firestore';
import deletePhoto from "../Storage/deletePhoto";
const CollectionName = "news";
const NewsCollection = collection(firestore, CollectionName);
const NewsDoc = (id: string) => doc(firestore, CollectionName, id);

export const addNews = (news: any) => {
    return getNews(1, [where("title", '==', news.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(NewsCollection, news);
        });
};

export const getSingleNews = (id: string) => {
    return getDoc(NewsDoc(id));
};

export const updateNews = (id: string, news: any) => {
    return updateDoc(NewsDoc(id), news);
};

export const getNews = (
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
    return getDocs(query(NewsCollection, ...transactionsConstraints));
};

export const deleteNews = (id: string, title: string) => {
    return deleteDoc(NewsDoc(id)).then(() => {
        return deletePhoto(title, 'News');
    });
};