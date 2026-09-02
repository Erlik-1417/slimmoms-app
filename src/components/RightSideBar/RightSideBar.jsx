import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './RightSideBar.css';
import { fallingLeaves } from '../../assets/images';
import { getLocalizedFoodName } from '../../utils/foodTranslations';

const RightSideBar = ({ liveResult, liveRecommendations }) => {
  const { userData } = useSelector(state => state.auth);
  const { daySummary, date } = useSelector(state => state.diary);
  const { t, i18n } = useTranslation();

  const formattedDate = date ? date.split('-').reverse().join('.') : new Date().toLocaleDateString('tr-TR').replaceAll('/', '.');
  const notAllowedList = userData?.notAllowedProducts || userData?.notAllowedFoods || [];
  const userDailyRate = userData?.dailyRate;

  const displayNotRecommended = (liveRecommendations && Array.isArray(liveRecommendations) && liveRecommendations.length > 0) 
    ? liveRecommendations 
    : (Array.isArray(notAllowedList) ? notAllowedList : []);
  
  const { kcalLeft, kcalConsumed, dailyRate: dayDailyRate, percentsOfDailyRate } = daySummary || {};

  return (
    <aside className="right-sidebar">
      <img src={fallingLeaves} alt="" className="sidebar-leaf leaf-bottom-right" />

      <div className="sidebar-content">
        <div className="sidebar-item">
          <h3 className="sidebar-title">{t('sidebar.summary')} {formattedDate}</h3>
          <ul className="sidebar-list">
            <li className="sidebar-list-item">
              <span>{t('sidebar.remaining')}</span>
              <span>{kcalLeft !== undefined ? Math.round(kcalLeft) : '000'} {t('products.calories')}</span>
            </li>
            <li className="sidebar-list-item">
              <span>{t('sidebar.consumed')}</span>
              <span>{kcalConsumed !== undefined ? Math.round(kcalConsumed) : '000'} {t('products.calories')}</span>
            </li>
            <li className="sidebar-list-item">
              <span>{t('sidebar.dailyRate')}</span>
              <span>{ (liveResult?.dailyRate || dayDailyRate || userDailyRate) ? Math.round(liveResult?.dailyRate || dayDailyRate || userDailyRate) : '000'} {t('products.calories')}</span>
            </li>
            <li className="sidebar-list-item">
              <span>{t('sidebar.percentDaily')}</span>
              <span>{ (liveResult?.dailyRate && kcalConsumed) ? Math.round((kcalConsumed / liveResult.dailyRate) * 100) : (percentsOfDailyRate !== undefined ? Math.round(percentsOfDailyRate) : '000') } %</span>
            </li>
          </ul>
        </div>
        <div className="sidebar-item">
          <h3 className="sidebar-title">{t('sidebar.notRecommended')}</h3>
          {displayNotRecommended && displayNotRecommended.length > 0 ? (
            <ul className="not-recommended-list animated-list">
               {displayNotRecommended.slice(0, 10).map((item, idx) => {
                 if (!item) return null;
                 const isObject = typeof item === 'object' && item !== null;
                 const name = getLocalizedFoodName(item, i18n.language) || (isObject ? (item.name || 'Product') : String(item));
                 const kcal = isObject ? item.kcal : undefined;

                 return (
                   <li key={idx} className="not-recommended-item">
                     <span className="not-recommended-name">{name}</span>
                     {kcal !== undefined && (
                       <span className="not-recommended-kcal">{kcal} kcal</span>
                     )}
                   </li>
                 );
               })}
            </ul>
          ) : (
            <p className="diet-hint">{t('sidebar.dietHint')}</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSideBar;
