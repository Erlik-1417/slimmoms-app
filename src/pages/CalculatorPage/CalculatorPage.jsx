import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { updateUserDataOperation } from '../../redux/auth/authOperations';
import { calculateCalories } from '../../utils/calculateCalories';
import axiosInstance from '../../redux/auth/axiosConfig';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import './CalculatorPage.css';

const bloodTypes = [1, 2, 3, 4];

const CalculatorPage = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.auth);
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const [form, setForm] = useState({
    height: userData?.height || '',
    age: userData?.age || '',
    weight: userData?.weight || '',
    desiredWeight: userData?.desiredWeight || '',
    bloodType: userData?.bloodType || 1,
  });

  React.useEffect(() => {
    if (userData?.height) {
      setForm({
        height: userData.height,
        age: userData.age,
        weight: userData.weight,
        desiredWeight: userData.desiredWeight,
        bloodType: userData.bloodType,
      });
    }
  }, [userData]);

  const liveResult = useMemo(() => {
    return calculateCalories({
      height: Number(form.height),
      weight: Number(form.weight),
      age: Number(form.age),
      desiredWeight: Number(form.desiredWeight),
      bloodType: Number(form.bloodType),
    });
  }, [form.height, form.weight, form.age, form.desiredWeight, form.bloodType]);

  React.useEffect(() => {
    const fetchRecs = async () => {
      try {
        const { data } = await axiosInstance.post('recommendations', {
          bloodType: Number(form.bloodType)
        });
        setRecommendations(data.notRecommended);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err.message);
      }
    };
    fetchRecs();
  }, [form.bloodType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!liveResult) return;
    setIsUpdating(true);
    setSaved(false);
    try {
      const resultAction = await dispatch(updateUserDataOperation({
        height: Number(form.height),
        weight: Number(form.weight),
        age: Number(form.age),
        desiredWeight: Number(form.desiredWeight),
        bloodType: Number(form.bloodType),
      }));
      
      if (updateUserDataOperation.fulfilled.match(resultAction)) {
        toast.success(t('calculatorPage.savedSuccess'));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000); 
      } else {
        toast.error(t('calculatorPage.serverError'));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="calc-page-wrapper">

      <div className="calc-left-col">
        <h2 className="calc-page-title">{t('calculator.title')}</h2>

        <form className="calc-live-form" onSubmit={handleSubmit} noValidate>

          <div className="calc-fields">
            {[
              { name: 'height',        label: t('form.height') },
              { name: 'age',           label: t('form.age') },
              { name: 'weight',        label: t('form.currentWeight') },
              { name: 'desiredWeight', label: t('form.desiredWeight') },
            ].map(({ name, label }) => (
              <div key={name} className="calc-field">
                <label className="calc-field-label">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="calc-field-input"
                  autoComplete="off"
                />
              </div>
            ))}

            <div className="calc-field calc-field-blood">
              <label className="calc-field-label">{t('form.bloodType')}</label>
              <div className="calc-blood-radios">
                {bloodTypes.map(type => (
                  <label key={type} className="calc-blood-option">
                    <input
                      type="radio"
                      name="bloodType"
                      value={type}
                      checked={Number(form.bloodType) === type}
                      onChange={handleChange}
                      className="calc-blood-radio"
                    />
                    <span className={`calc-blood-num ${Number(form.bloodType) === type ? 'selected' : ''}`}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="calc-submit-wrap">
            <button type="submit" className="calc-start-btn" disabled={!liveResult || isUpdating}>
              {isUpdating ? t('calculatorPage.calculating') : t('form.submit')}
            </button>
            {saved && <span className="calc-success-msg">{t('calculatorPage.savedCheck')}</span>}
          </div>
        </form>
      </div>

      <div className="calc-right-col">
          <RightSideBar 
            liveResult={liveResult} 
            liveRecommendations={recommendations} 
          />
      </div>

    </div>
  );
};

export default CalculatorPage;
