import LanguageContext from '../shared/LanguageContext';
import { useState } from 'react';
export default function LanguageProvider ({children}) {
    const [language, setLanguage] = useState('devanagari');
    return (
        <LanguageContext.Provider value={{language, setLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
}