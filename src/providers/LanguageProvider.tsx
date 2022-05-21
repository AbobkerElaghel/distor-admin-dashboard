import React, { createContext, useState } from 'react';
import LanguageType from '../types/LanguageType';
interface LangContextType {
    language: LanguageType;
    setLanguage: (language: LanguageType) => void;
};

export const LanguageContext = createContext<LangContextType | null>(null);
const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLang] = useState<LanguageType>("english");

    const setLanguage = (lang: LanguageType) => {
        setLang(lang)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
};

export default LanguageProvider;