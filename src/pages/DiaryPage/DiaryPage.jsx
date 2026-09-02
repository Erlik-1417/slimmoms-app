import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DiaryDateCalendar from '../../components/DiaryDateCalendar/DiaryDateCalendar';
import DiaryAddProductForm from '../../components/DiaryAddProductForm/DiaryAddProductForm';
import DiaryProductsList from '../../components/DiaryProductsList/DiaryProductsList';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import { getDayInfoOperation } from '../../redux/diary/diaryOperations';
import { setDate } from '../../redux/diary/diarySlice';
import './DiaryPage.css';

const DiaryPage = () => {
  const dispatch = useDispatch();
  const { date } = useSelector(state => state.diary);

  useEffect(() => {
    dispatch(getDayInfoOperation(date));
  }, [dispatch, date]);

  const handleDateChange = (newDate) => {
    dispatch(setDate(newDate));
  };

  return (
    <div className="diary-page-wrapper">
      
      <div className="diary-left-col">
        <DiaryDateCalendar
          selectedDate={date}
          onDateChange={handleDateChange}
        />
        <DiaryAddProductForm date={date} />
        <DiaryProductsList date={date} />
      </div>

      <div className="diary-right-col">
        <RightSideBar />
      </div>
    </div>
  );
};

export default DiaryPage;
