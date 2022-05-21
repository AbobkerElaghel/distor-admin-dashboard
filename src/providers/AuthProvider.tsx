import { User } from 'firebase/auth';
import React, { createContext, useState } from 'react';
import { firebaseEmailSignIn, firebaseSignOut } from '../firebase/auth'

interface AuthProvierContextType {
    user: UserType | undefined;
    signIn: (email: string, password: string) => Promise<User>;
    signOut: () => void;
};

interface UserType extends User {
    admin: boolean;
    editor: boolean;
    reader: boolean;
}

export const AuthContext = createContext<AuthProvierContextType | null>(null);

const AuthProvier: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType>();

    const signOut = () => {
        return firebaseSignOut()
            .then(() => {
                setUser(undefined)
            });
    };

    const signIn = (email: string, password: string): Promise<any> => {
        return firebaseEmailSignIn(email, password)
            .then(({ user }) => {
                return user
                    .getIdTokenResult()
                    .then(({ claims }) => {
                        setUser({ ...user, ...claims } as UserType)
                    })
                // if(user.emailVerified ) ADD  THIS WHEN FINISHING WITH USER ADDITION
            })
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvier;

