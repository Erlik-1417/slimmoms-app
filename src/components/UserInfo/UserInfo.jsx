import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logoutOperation } from '../../redux/auth/authOperations';
import './UserInfo.css';

const UserInfo = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="user-info">
      <span className="user-name">{user?.name}</span>
      <div className="user-divider"></div>
      <button className="logout-btn" onClick={() => dispatch(logoutOperation())}>{t('nav.exit')}</button>
    </div>
  );
};

export default UserInfo;
