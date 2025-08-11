import React, { useEffect, type Dispatch, type SetStateAction } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Button, Calendar } from 'antd';
import dayLocaleData from 'dayjs/plugin/localeData';
import Heading from './Heading';
import Text from './Text';
import { formatNumber } from '../hooks/formatNumber';
import { FindMonth } from '../hooks/findMonth';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
dayjs.extend(dayLocaleData);

const wrapperStyle: React.CSSProperties = {
  width: "100%",
};

const CustomCalendar: React.FC<{totalForMonth:number | string, setNowDate: Dispatch<SetStateAction<dayjs.Dayjs | undefined>>, nowDate: dayjs.Dayjs | undefined }> = ({ nowDate, setNowDate, totalForMonth }) => {
 

  function handleChooseDay(value: any) {
    setNowDate(value);
  }
  function handleChangeMonth(value: dayjs.Dayjs, onChange: (date: dayjs.Dayjs) => void) {
    const newMonth = value.add(1, 'month');
    onChange(newMonth);
  }

  function handleChangeMonth2(value: dayjs.Dayjs, onChange: (date: dayjs.Dayjs) => void) {
    const newMonth = value.subtract(1, 'month');
    onChange(newMonth);
  }

  
const uzWeekDays = ['YA', 'DU', 'SE', 'CH', 'PA', 'JU', 'SH'];


  return (
    <div style={wrapperStyle} className='calendar'>
      <Calendar
        onChange={handleChooseDay}
        fullscreen={false}
        value={nowDate}
        headerRender={({ value, onChange }) => {
          useEffect(() => {
            setNowDate(value)
          },[])
          return (
            <div className='sticky z-10 top-[58px] bg-white'>
              <div className="flex items-center justify-between !mt-[36px]">
                <Heading tag="h2" classList="!font-bold !text-[18px]">{FindMonth(value.month())}, {value.year()}</Heading>
                <div className="space-x-[16px]">
                  <Button onClick={() => handleChangeMonth2(value, onChange)} className="!w-[40px] !p-0 hover:!border-[#735CD8] !rounded-[12px] !h-[40px]"><LeftOutlined /></Button>
                  <Button onClick={() => handleChangeMonth(value, onChange)} className="!w-[40px] !p-0 hover:!border-[#735CD8] !rounded-[12px] !h-[40px]"><RightOutlined/></Button>
                </div>
              </div>
              <div className="flex items-center justify-between my-[20px]">
                <Text classList="!font-medium !text-[20px]">Oylik jami:</Text>
                <strong className="text-[20px] font-bold">{formatNumber(totalForMonth)} <span className="font-medium">so‘m</span></strong>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-semibold my-[10px]">
            {uzWeekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
            </div>
          )
        }}
      />
    </div>
  );
};

export default CustomCalendar;
