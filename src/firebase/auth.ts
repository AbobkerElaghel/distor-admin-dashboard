import { connectAuthEmulator, browserLocalPersistence, signInWithEmailAndPassword, sendPasswordResetEmail, initializeAuth } from "firebase/auth";
import firebaseConfigApp from "./configApp";

export const auth = initializeAuth(firebaseConfigApp);

auth.setPersistence(browserLocalPersistence);

export const firebaseEmailSignIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const firebaseSignOut = () => {
    return auth.signOut();
};

export const firebaseResetEmail = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};