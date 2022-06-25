import { collection, where, addDoc, getDoc, doc, updateDoc, QueryConstraint, QueryDocumentSnapshot, DocumentData, limit, orderBy, startAfter, getDocs, query, deleteDoc } from "firebase/firestore";
import firestore from '../firestore';
import deletePhoto from "../Storage/deletePhoto";
const CollectionName = 'blogs';
const BlogsCollection = collection(firestore, CollectionName);
const BlogDoc = (id: string) => doc(firestore, CollectionName, id);

export const addBlogs = (blog: any) => {
    return getBlogs(1, [where("title", '==', blog.title)])
        .then((doc) => {
            if (doc.size !== 0) {
                throw new Error("Title Name is Used Already");
            }
            return addDoc(BlogsCollection, blog);
        });
}

export const getSingleBlog = (id: string) => {
    return getDoc(BlogDoc(id));
};

export const updateBlog = (id: string, blog: any) => {
    return updateDoc(BlogDoc(id), blog);
};

export const getBlogs = (
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
    return getDocs(query(BlogsCollection, ...transactionsConstraints));
};

export const deleteBlog = (id: string, title: string) => {
    return deleteDoc(BlogDoc(id)).then(() => {
        return deletePhoto(title, 'Blogs');
    });
};
