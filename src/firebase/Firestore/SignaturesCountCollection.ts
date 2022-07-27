import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import firestore from '../firestore';

export const decrementSignaturesCount = () => {
    return getDoc(doc(firestore, "signaturesCount", "count"))
        .then((document) => {
            if (document.exists()) {
                if (document.data().count && document.data().count > 0) {
                    return updateDoc(doc(firestore, "signaturesCount", "count"), { count: increment(-1) });
                }
            }
        })
};