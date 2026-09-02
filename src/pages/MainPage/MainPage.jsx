import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HomePageDecoration } from '../../components/Layout/Decoration';
import DailyCaloriesForm from '../../components/DailyCaloriesForm/DailyCaloriesForm';
import Modal from '../../components/Modal/Modal';
import DailyCalorieIntake from '../../components/DailyCalorieIntake/DailyCalorieIntake';
import axios from 'axios';
import './MainPage.css';

const calculateDailyIntake = (weight, height, age, desiredWeight) => {
  
  const result = (10 * weight) + (6.25 * height) - (5 * age) - 161 - (10 * (weight - desiredWeight));
  return Math.round(result);
};

const MainPage = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleCalculate = async (values) => {
    const calories = calculateDailyIntake(
      Number(values.weight),
      Number(values.height),
      Number(values.age),
      Number(values.desiredWeight)
    );

    let notAllowedList = [t('notAllowed.milk'), t('notAllowed.sourCream'), t('notAllowed.flourProducts')];
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://slimmoms-app.onrender.com/api';
      const response = await axios.post(`${apiUrl}/calculator/public`, {
        weight: Number(values.weight),
        height: Number(values.height),
        age: Number(values.age),
        desiredWeight: Number(values.desiredWeight),
        bloodType: Number(values.bloodType) || 1,
      }, { timeout: 2500 });
      
      if (response.data?.notAllowedProducts?.length > 0) {
        notAllowedList = response.data.notAllowedProducts.slice(0, 4);
      }
    } catch (err) {
      console.warn('Could not fetch recommendations from API, using fallback list:', err.message);
    }

    setData({
      dailyRate: calories,
      notAllowed: notAllowedList,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <HomePageDecoration />
      <div className="main-page-content">
        <DailyCaloriesForm
          title={t('main.title')}
          onCalculate={handleCalculate}
        />
      </div>

      {isModalOpen && data && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <DailyCalorieIntake
            dailyRate={data.dailyRate}
            notAllowed={data.notAllowed}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default MainPage;
