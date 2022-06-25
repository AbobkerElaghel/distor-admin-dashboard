import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

const app = admin.initializeApp();
const regionedFunctions = functions.region("europe-west1");

export const adminAddUser = regionedFunctions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Not signed in');
    };

    if (!context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Not an admin');
    };

    const { email, password, displayName, roles, photoURL } = data as {
        email: string;
        password: string;
        displayName: string;
        // phoneNumber: string;
        roles: { [role: string]: boolean };
        photoURL: string | undefined | null;
    };

    if (!email) {
        throw new functions.https.HttpsError("invalid-argument", 'Email is invalid');
    }
    if (!displayName) {
        throw new functions.https.HttpsError('invalid-argument', 'name is invalid');
    }
    if (!roles.admin && !roles.reader && !roles.editor) {
        throw new functions.https.HttpsError('invalid-argument', 'roles are invalid');
    }
    if (!password) {
        throw new functions.https.HttpsError('invalid-argument', 'password are invalid');
    }

    const user = await app.auth().createUser({
        email,
        displayName,
        // phoneNumber,
        emailVerified: true,
        password,
        photoURL: photoURL ? photoURL : undefined,
    }).catch(error => {
        throw new functions.https.HttpsError(error.code || 'aborted', error.message || 'Error with Creating new User');
    });

    if (roles.admin) {
        await app.auth().setCustomUserClaims(user.uid, {
            admin: true,
            editor: true,
            reader: true
        });
        return user;
    };

    if (roles.editor) {
        await app.auth().setCustomUserClaims(user.uid, {
            admin: false,
            editor: true,
            reader: true
        })
        return user;
    };

    if (roles.reader) {
        await app.auth().setCustomUserClaims(user.uid, {
            admin: false,
            editor: false,
            reader: true
        })
        return user;
    };
});

export const getAllUsers = regionedFunctions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Not signed in');
    };

    if (!context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Not an admin');
    };

    return app.auth().listUsers();
});

export const changeUserStatus = regionedFunctions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Not signed in');
    };

    if (!context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Not an admin');
    };

    const { uid, status } = data;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing arguments');
    }
    await app.auth().updateUser(uid, { disabled: status })
        .catch(error => {
            throw new functions.https.HttpsError('aborted', error.message || 'Error with changing account status');
        });
    return;
});

export const deleteUser = regionedFunctions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Not signed in');
    };

    if (!context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Not an admin');
    };

    const { uid } = data;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing arguments');
    }
    await app.auth().deleteUser(uid)
        .catch(error => {
            throw new functions.https.HttpsError('aborted', error.message || 'Error with deleting the user account');
        });
    return;
});

export const incrementSignatures = regionedFunctions.firestore
    .document('signatures/{signatureId}')
    .onCreate(async () => {
        await app.firestore().collection('signaturesCount').doc("count").update({ count: admin.firestore.FieldValue.increment(1) });
    });