import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useSelector } from 'react-redux';
import './Layout.css';

const Loader = () => {
  const { isLoading } = useSelector(state => state.loader);
  if (!isLoading) return null;
  return (
    <div className="loader-backdrop">
      <div className="loader-spinner"></div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Header />
      <Loader />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
