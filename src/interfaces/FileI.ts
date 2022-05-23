import { FieldValue } from "firebase/firestore";

export interface FileI {
    title: string;
    date: Date | FieldValue;
    Icon?: any;
    category: string;
    lang: string;
    fileURL: string;
    id?: string;
    userId: string;
}