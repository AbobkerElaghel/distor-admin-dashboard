import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import firebaseConfigApp from './configApp';

const functions = getFunctions(firebaseConfigApp, "europe-west1");

if (process.env.NODE_ENV === "development") {
    connectFunctionsEmulator(functions, "localhost", 5001);
}

export const adminAddUser = httpsCallable(functions, 'adminAddUser');
export const getAllUsers = httpsCallable(functions, 'getAllUsers');
export const changeUserStatus = httpsCallable(functions, 'changeUserStatus');
export const deleteUser = httpsCallable(functions, 'deleteUser');


