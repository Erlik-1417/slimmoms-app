import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Logo.css';

import logoSvg from '../../assets/logo.svg';

const Logo = () => {
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <Link to={isLoggedIn ? "/diary" : "/"} className="logo">
      <div className="logo-icon-wrapper">
        <img src={logoSvg} alt="SlimMoms Logo" className="logo-icon-svg" />
      </div>
      <div className="logo-text">
        <span className="logo-slim">Slim</span>
        <span className="logo-mom">Mom</span>
      </div>
    </Link>
  );
};

export default Logo;
