import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logIn } from '../../redux/auth/authOperations';
import { LoginPageDecoration } from '../Layout/Decoration';
import './LoginForm.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [serverError, setServerError] = React.useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email(t('validation.invalidEmail')).required(t('validation.required')),
      password: Yup.string().min(4, t('validation.minChars', { min: 4 })).max(12, t('validation.maxChars', { max: 12 })).required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      setServerError('');
      try {
        await dispatch(logIn(values)).unwrap();
        navigate('/diary');
      } catch (err) {
        if (err === 'Email or password is wrong') {
          setServerError(t('auth.incorrectCredentials'));
        } else if (err.includes?.('Network Error') || err.includes?.('failed') || err.includes?.('ECONNREFUSED')) {
          setServerError(t('auth.serverConnectionError'));
        } else {
          setServerError(err || t('auth.profileNotFound'));
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
        <h1 className="auth-heading">{t('auth.loginTitle')}</h1>
        <form onSubmit={formik.handleSubmit} className="auth-form">
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
          <div className="auth-btn-group">
            <button type="submit" className="auth-btn">{t('auth.loginBtn')}</button>
            <Link to="/register" className="auth-btn-link">
              <button type="button" className="auth-btn">{t('auth.registerBtn')}</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
