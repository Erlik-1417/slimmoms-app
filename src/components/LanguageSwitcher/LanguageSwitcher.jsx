import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('tr') ? 'tr' : 'en';

  const switchTo = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${currentLang === 'en' ? 'lang-btn--active' : ''}`}
        onClick={() => switchTo('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${currentLang === 'tr' ? 'lang-btn--active' : ''}`}
        onClick={() => switchTo('tr')}
        aria-label="Türkçeye geç"
      >
        TR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
