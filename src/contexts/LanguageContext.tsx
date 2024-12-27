import React, { createContext, useState, useContext, useEffect } from 'react';

type LanguageContextType = {
  language: 'en' | 'fr';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'fr') => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'fr'>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('appLanguage');
    if (stored === 'en' || stored === 'fr') {
      return stored;
    }

    // If no stored preference, check browser language
    const browserLang = navigator.language.toLowerCase();

    // Handling only English and French for now
    return browserLang.startsWith('fr') ? 'fr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState(current => current === 'en' ? 'fr' : 'en');
  };

  const setLanguage = (lang: 'en' | 'fr') => {
    setLanguageState(lang);
  };

  return (
      <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
        {children}
      </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);