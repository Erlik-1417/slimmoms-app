import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import DiaryPage from './pages/DiaryPage/DiaryPage';
import CalculatorPage from './pages/CalculatorPage/CalculatorPage';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from './redux/auth/authOperations';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children, restricted }) => {
  const { isLoggedIn } = useSelector(state => state.auth);
  return isLoggedIn && restricted ? <Navigate to="/diary" /> : children;
};

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PublicRoute restricted><MainPage /></PublicRoute>} />
          <Route path="login" element={<PublicRoute restricted><LoginPage /></PublicRoute>} />
          <Route path="register" element={<PublicRoute restricted><RegistrationPage /></PublicRoute>} />
          
          <Route path="diary" element={<PrivateRoute><DiaryPage /></PrivateRoute>} />
          <Route path="calculator" element={<PrivateRoute><CalculatorPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
