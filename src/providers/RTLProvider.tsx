import React, { createContext, useEffect, useState } from 'react';

interface RTLContextType {
    isRTL: boolean
    setRTLMode: (param: boolean) => void
};

export const RTLContext = createContext<RTLContextType | null>(null);
const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRTL, setIsRTL] = useState(false);

    useEffect(() => {
        const rtl = localStorage.getItem('rtl');

        if (rtl === 'true') {
            setRTLMode(true);
        } else if (rtl === 'false') {
            setRTLMode(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const setRTLMode = (param: boolean) => {
        setIsRTL(param);
        if (param) {
            localStorage.setItem("rtl", 'true');
            document.dir = 'rtl';
        } else {
            localStorage.setItem("rtl", 'false');
            document.dir = 'ltr';
        }
    }

    return (
        <RTLContext.Provider value={{ isRTL, setRTLMode }}>
            {children}
        </RTLContext.Provider>
    )
};

export default RTLProvider;