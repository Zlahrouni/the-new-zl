import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the type for the language context
type LanguageContextType = {
  language: 'en' | 'fr';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'fr') => void;
};

// Create the context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {}
});

// Language Provider Component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'fr'>(() => {
    // Initialize from local storage, default to 'en'
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage === 'fr' ? 'fr' : 'en';
  });

  // Update local storage whenever language changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Toggle between languages
  const toggleLanguage = () => {
    setLanguageState(current => current === 'en' ? 'fr' : 'en');
  };

  // Set language directly
  const setLanguage = (lang: 'en' | 'fr') => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);