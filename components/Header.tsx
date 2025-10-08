import React from 'react';
import { useTranslation } from '../i18n';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'ar' : 'fr';
    setLanguage(newLang);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <i className="fas fa-school text-3xl text-blue-600"></i>
          <span className="text-2xl font-bold text-slate-800">
            {t('header.title')}
          </span>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              onClick={toggleLanguage}
              className="text-slate-600 font-semibold hover:text-blue-600 transition-colors px-3 py-1 rounded-md"
              aria-label="Changer de langue"
            >
              {t('header.language')}
            </button>
            <i className="fas fa-user-circle text-2xl text-slate-600"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
