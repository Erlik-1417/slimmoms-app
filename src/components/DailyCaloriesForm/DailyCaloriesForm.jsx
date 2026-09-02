import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import './DailyCaloriesForm.css';

const bloodTypes = [1, 2, 3, 4];

const DailyCaloriesForm = ({ onCalculate, title, initialValues = {} }) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      height: initialValues.height || '',
      age: initialValues.age || '',
      weight: initialValues.weight || '',
      desiredWeight: initialValues.desiredWeight || '',
      bloodType: initialValues.bloodType || 1,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      height: Yup.number()
        .min(100, t('validation.minVal', { min: 100 }))
        .max(250, t('validation.maxVal', { max: 250 }))
        .required(t('validation.required')),
      age: Yup.number()
        .min(18, t('validation.minVal', { min: 18 }))
        .max(100, t('validation.maxVal', { max: 100 }))
        .required(t('validation.required')),
      weight: Yup.number()
        .min(20, t('validation.minVal', { min: 20 }))
        .max(500, t('validation.maxVal', { max: 500 }))
        .required(t('validation.required')),
      desiredWeight: Yup.number()
        .min(20, t('validation.minVal', { min: 20 }))
        .max(500, t('validation.maxVal', { max: 500 }))
        .required(t('validation.required')),
      bloodType: Yup.number().oneOf([1, 2, 3, 4]).required(t('validation.required')).nullable(),
    }),
    onSubmit: (values) => {
      onCalculate(values);
    },
  });

  return (
    <div className="calc-form-wrap">
      <h2 className="calc-form-title">{title}</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="calc-inner-div">
          <div className="calc-col-left">
            <div className="calc-input-wrap">
              <span className="calc-label">{t('form.height')}</span>
              <input
                className="calc-input"
                name="height"
                {...formik.getFieldProps('height')}
              />
              {formik.touched.height && formik.errors.height && (
                <div className="calc-error">{formik.errors.height}</div>
              )}
            </div>
            <div className="calc-input-wrap">
              <span className="calc-label">{t('form.age')}</span>
              <input
                className="calc-input"
                name="age"
                {...formik.getFieldProps('age')}
              />
              {formik.touched.age && formik.errors.age && (
                <div className="calc-error">{formik.errors.age}</div>
              )}
            </div>
            <div className="calc-input-wrap">
              <span className="calc-label">{t('form.currentWeight')}</span>
              <input
                className="calc-input"
                name="weight"
                {...formik.getFieldProps('weight')}
              />
              {formik.touched.weight && formik.errors.weight && (
                <div className="calc-error">{formik.errors.weight}</div>
              )}
            </div>
          </div>

          <div className="calc-col-right">
            <div className="calc-input-wrap">
              <span className="calc-label">{t('form.desiredWeight')}</span>
              <input
                className="calc-input"
                name="desiredWeight"
                {...formik.getFieldProps('desiredWeight')}
              />
              {formik.touched.desiredWeight && formik.errors.desiredWeight && (
                <div className="calc-error">{formik.errors.desiredWeight}</div>
              )}
            </div>
            <div className="calc-blood-wrap">
              <span className="calc-label">{t('form.bloodType')}</span>
              <div className="calc-radio-wrap" role="group">
                {bloodTypes.map(type => {
                  const isChecked = Number(formik.values.bloodType) === type;
                  return (
                    <label key={type} className="calc-radio-label">
                      <input
                        type="radio"
                        name="bloodType"
                        value={type}
                        checked={isChecked}
                        onChange={formik.handleChange}
                        className="calc-radio-input"
                      />
                      <span className={isChecked ? 'calc-radio-span checked' : 'calc-radio-span'}>
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
              {formik.touched.bloodType && formik.errors.bloodType && (
                <div className="calc-error-blood">{formik.errors.bloodType}</div>
              )}
            </div>
          </div>
        </div>

        <div className="calc-btn-wrap">
          <button
            type="submit"
            className="calc-submit-btn"
            disabled={!formik.isValid || !formik.dirty}
          >
            {t('form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyCaloriesForm;
