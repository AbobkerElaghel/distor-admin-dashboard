import { User } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth, firebaseEmailSignIn, firebaseSignOut } from '../firebase/auth'
import CryptoJS from 'crypto-js';
import { useLocation } from "wouter";


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
    const [_, setLocation] = useLocation();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const qwkasd = localStorage.getItem("qvpakfm,z's");
        const ewkasd = localStorage.getItem("evpakfm,z's");
        const dqwkasdte = localStorage.getItem("dateqvpakfm,z's");

        if (ewkasd) {
            if (qwkasd) {
                if (dqwkasdte) {
                    const HOUR = 1000 * 60 * 60;
                    const anHourAgo = Date.now() - HOUR;
                    if ((+dqwkasdte) > anHourAgo) {
                        firebaseEmailSignIn(CryptoJS.enc.Base64.parse(ewkasd).toString(CryptoJS.enc.Utf8), CryptoJS.enc.Base64.parse(qwkasd).toString(CryptoJS.enc.Utf8))
                            .then(({ user }) => {
                                return user
                                    .getIdTokenResult()
                                    .then(({ claims }) => {
                                        setUser({ ...user, ...claims } as UserType);
                                        setLocation('/');
                                    })
                            })
                    } else {
                        localStorage.removeItem("qvpakfm,z's");
                        localStorage.removeItem("evpakfm,z's");
                        localStorage.removeItem("dateqvpakfm,z's");
                    }
                }
            }
        }




    }, [])

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
                        setUser({ ...user, ...claims } as UserType);
                        localStorage.setItem("evpakfm,z's", CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(email)));
                        localStorage.setItem("qvpakfm,z's", CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password)));
                        localStorage.setItem("dateqvpakfm,z's", new Date().getTime().toString());
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

