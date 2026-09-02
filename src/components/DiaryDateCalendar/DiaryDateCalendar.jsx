import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DiaryDateCalendar.css';

const DiaryDateCalendar = ({ selectedDate, onDateChange }) => {
  const dateObj = new Date(selectedDate);

  const formatToYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="calendar-wrapper">
      <h2 className="calendar-title">
        {selectedDate.split('-').reverse().join('.')}
      </h2>
      <DatePicker
        selected={dateObj}
        onChange={(date) => onDateChange(formatToYMD(date))}
        className="calendar-input-hidden"
        customInput={
          <button className="calendar-icon-btn">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0.01 2.9 0.01 4L0 18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM16 18H2V7H16V18ZM5 9H3V11H5V9ZM9 9H7V11H9V9ZM13 9H11V11H13V9ZM5 13H3V15H5V13ZM9 13H7V15H9V13ZM13 13H11V15H13V13Z" fill="#9B9FAA"/>
            </svg>
          </button>
        }
      />
    </div>
  );
};

export default DiaryDateCalendar;
