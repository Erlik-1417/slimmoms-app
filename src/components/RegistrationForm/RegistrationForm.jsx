import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { register } from '../../redux/auth/authOperations';
import { LoginPageDecoration } from '../Layout/Decoration';
import '../LoginForm/LoginForm.css';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData } = useSelector(state => state.auth);
  const [serverError, setServerError] = React.useState('');

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(4, t('validation.minChars', { min: 4 })).max(12, t('validation.maxChars', { max: 12 })).required(t('validation.required')),
      email: Yup.string().email(t('validation.invalidEmail')).required(t('validation.required')),
      password: Yup.string().min(4, t('validation.minChars', { min: 4 })).max(12, t('validation.maxChars', { max: 12 })).required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      setServerError('');
      try {
        await dispatch(register({ ...values, userData })).unwrap();
        navigate('/login');
      } catch (err) {
        console.error(err);
        if (err === 'Bu profil zaten kayıtlı' || err === 'Already registered') {
          setServerError(t('auth.alreadyRegistered'));
        } else if (err.includes?.('Network Error') || err.includes?.('failed') || err.includes?.('ECONNREFUSED')) {
          setServerError(t('auth.serverConnectionError'));
        } else {
          setServerError(err || t('auth.alreadyRegistered'));
        }
      }
    },
  });

  return (
    <>
      <LoginPageDecoration />
      <div className="auth-form-container">
        {serverError && (
          <div className="auth-notification auth-warning">{serverError}</div>
        )}
        <h1 className="auth-heading">{t('auth.registerTitle')}</h1>
        <form onSubmit={formik.handleSubmit} className="auth-form">
          <input
            name="name"
            type="text"
            placeholder={t('auth.namePlaceholder')}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="auth-error">{formik.errors.name}</div>
          )}
          <input
            name="email"
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="auth-error">{formik.errors.email}</div>
          )}
          <input
            name="password"
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="auth-error">{formik.errors.password}</div>
          )}
          <div className="auth-btn-group-register">
            <button type="submit" className="auth-btn">{t('auth.registerBtn')}</button>
            <Link to="/login" className="auth-btn-link">
              <button type="button" className="auth-btn">{t('auth.loginBtn')}</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationForm;
