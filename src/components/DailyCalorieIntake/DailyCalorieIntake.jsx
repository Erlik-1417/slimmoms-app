import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedFoodName } from '../../utils/foodTranslations';
import './DailyCalorieIntake.css';

const DailyCalorieIntake = ({ dailyRate, notAllowed, onClose }) => {
  const { t, i18n } = useTranslation();
  const filterNotAllowed = notAllowed ? notAllowed.slice(0, 4) : [];

  return (
    <div className="dci-container">
      <h2 className="dci-title">{t('modal.title')}</h2>
      
      <p className="dci-calories">
        {Math.round(dailyRate)}
        <span className="dci-calories-unit"> {t('products.calories')}</span>
      </p>

      <div className="dci-line" />
      
      <div className="dci-products-section">
        <h3 className="dci-products-heading">{t('modal.notRecommended')}</h3>
        <ol className="dci-products-list">
          {filterNotAllowed.map((product, idx) => (
            <li key={idx}>
              {getLocalizedFoodName(product, i18n.language) || product}
            </li>
          ))}
        </ol>
      </div>

      <div className="dci-actions">
        <button className="dci-button" onClick={onClose}>
          <Link to="/register" className="dci-link">
            {t('modal.startButton')}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default DailyCalorieIntake;
