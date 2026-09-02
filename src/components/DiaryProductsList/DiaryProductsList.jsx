import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { deleteProductOperation } from '../../redux/diary/diaryOperations';
import { getLocalizedFoodName } from '../../utils/foodTranslations';
import './DiaryProductsList.css';

const DiaryProductsList = ({ date }) => {
  const dispatch = useDispatch();
  const { eatenProducts } = useSelector(state => state.diary);
  const { t, i18n } = useTranslation();

  const handleDelete = (productId) => {
    dispatch(deleteProductOperation({ date, productId }));
  };

  return (
    <ul className="diary-list">
      <AnimatePresence>
        {eatenProducts.map((item) => (
          <Motion.li
            key={item._id || item.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            layout
            className="product-item"
          >
            <span className="product-title">{getLocalizedFoodName(item.title, i18n.language) || item.title}</span>
            <span className="product-weight">{item.weight} {t('products.weight')}</span>
            <span className="product-calories">{item.kcal} {t('products.calories')}</span>
            <button onClick={() => handleDelete(item._id || item.id)} className="delete-btn">×</button>
          </Motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default DiaryProductsList;
