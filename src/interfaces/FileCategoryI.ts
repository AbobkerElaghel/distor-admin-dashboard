import { FieldValue } from "firebase/firestore";

export interface FileCategoryI {
    title: string;
    id?: string;
    lang: string;
    userId: string;
    date: Date | FieldValue;
}