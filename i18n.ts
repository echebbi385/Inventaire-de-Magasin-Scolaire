import React, { createContext, useState, useContext, useEffect, FC, PropsWithChildren } from 'react';
import fr from './locales/fr';
import ar from './locales/ar';

const translations = { fr, ar };

type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (obj: any, key: string): string => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj) || key;
};

export const LanguageProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return getNestedTranslation(translations[language], key);
  };

  // Fix: Replaced JSX with React.createElement to resolve parsing errors.
  // The original JSX syntax is not supported in a .ts file by default and was causing all the reported errors.
  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
