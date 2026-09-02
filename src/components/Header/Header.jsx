import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo/Logo';
import UserInfo from '../UserInfo/UserInfo';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

const Header = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-left">
          <Logo />

          <ul className="nav-list main-nav desktop-nav">
            {isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/diary" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    {t('nav.diary')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/calculator" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    {t('nav.calculator')}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    {t('nav.login')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    {t('nav.register')}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="header-right">
          <div className="header-controls">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {isLoggedIn && (
            <div className="header-user-status">
              <UserInfo />
            </div>
          )}

          {isLoggedIn && (
            <button
              className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          )}

          {!isLoggedIn && (
            <ul className="public-mobile-nav">
              <li>
                <NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('nav.login')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('nav.register')}
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {isLoggedIn && (
        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'visible' : ''}`}>
          <div className="mobile-nav-content">
            <NavLink
              to="/diary"
              className={({isActive}) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.diary')}
            </NavLink>
            <NavLink
              to="/calculator"
              className={({isActive}) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.calculator')}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
