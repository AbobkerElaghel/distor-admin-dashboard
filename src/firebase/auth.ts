import { connectAuthEmulator, signInWithEmailAndPassword, sendPasswordResetEmail, initializeAuth } from "firebase/auth";
import firebaseConfigApp from "./configApp";

const auth = initializeAuth(firebaseConfigApp);

if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, 'http://localhost:9099');
}

export const firebaseEmailSignIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const firebaseSignOut = () => {
    return auth.signOut();
};

export const firebaseResetEmail = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};