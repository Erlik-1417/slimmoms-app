import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();

  return (
    <nav className="main-nav">
      <NavLink to="/diary" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>{t('nav.diary')}</NavLink>
      <NavLink to="/calculator" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>{t('nav.calculator')}</NavLink>
    </nav>
  );
};

export default Navigation;
