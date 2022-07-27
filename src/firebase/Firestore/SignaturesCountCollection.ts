import { doc, increment, updateDoc } from "firebase/firestore";
import firestore from '../firestore';

export const decrementSignaturesCount = () => {
    return updateDoc(doc(firestore, "signaturesCount", "count"), { count: increment(1) });
};