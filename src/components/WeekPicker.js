import React, { useState } from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';

export const WeekPicker = () => {
  // Lấy ngày đầu tuần hiện tại (Thứ 2) và ngày cuối tuần (Chủ nhật)
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week').add(1, 'day')); // Thứ 2

  const getWeekRange = (startOfWeek) => {
    const startDate = startOfWeek.format('DD MMM');
    const endDate = startOfWeek.add(6, 'day').format('DD MMM YYYY');
    return `< ${startDate} - ${endDate} >`;
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => prev.add(7, 'day')); // Chuyển sang tuần tiếp theo
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => prev.subtract(7, 'day')); // Chuyển sang tuần trước
  };

  return (
    <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Button onClick={handlePreviousWeek}>◀️ </Button>
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{getWeekRange(currentWeekStart)}</span>
        <Button onClick={handleNextWeek}>▶️ </Button>
        </div>
        <div>
        {Array.from({ length: 7 }).map((_, index) => {
            const date = currentWeekStart.clone().add(index, 'day');
            return (
              <div key={index}>
                <p>{date.format('ddd')} {date.format('DD MMM YYYY')}</p>
              </div>
            );
        })}
        </div>
    </>
  );
};