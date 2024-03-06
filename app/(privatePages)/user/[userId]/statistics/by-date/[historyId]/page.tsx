'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import XLSX from 'xlsx';
import Title from '@/components/Title';
import BackStatisticsBtn from '@/components/buttons/BackStatisticsBtn';
import { getUserHistoryDetails } from '@/fetch-actions/historyFetchActions';
import { IHistoryDetailsResponce } from '@/globaltypes/historyTypes';

export default function HistoryDetails({
  params,
}: {
  params: { userId: string; historyId: string };
}) {
  const [userHistoryDetails, setUserHistoryDetails] = useState<IHistoryDetailsResponce[]>([]);

  const userId = Number(params.userId);
  const historyId = String(params.historyId);

  const memoizedUserHistoryDetails = useCallback(async () => {
    const userHistory: IHistoryDetailsResponce[] | undefined = await getUserHistoryDetails(
      historyId
    );

    if (userHistory) setUserHistoryDetails(userHistory);
  }, [historyId]);

  useEffect(() => {
    memoizedUserHistoryDetails();
  }, [memoizedUserHistoryDetails]);

  const handleClick = async () => {
    try {
      const formatedHistory: any[] = [];

      userHistoryDetails.forEach(history => {
        formatedHistory.push({
          tel: history.tel,
          date: new Date(history.sending_group_date).toLocaleDateString('uk-UA', {
            timeZone: 'UTC',
          }),
          countSMS: history.recipient_status.length,
          status: history.recipient_status.every(item => item === 'fullfield')
            ? 'Доставлено'
            : 'Недоставлено',
        });
      });

      const keysObject = Object.keys(formatedHistory[0]);
      const ws = XLSX.utils.json_to_sheet(formatedHistory, { header: keysObject });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, ws, 'Sheet 1');
      XLSX.writeFile(workbook, `Statistics.xlsx`);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <section className="container mx-auto">
      <Title type="h1" color="dark">
        Детальна статистика
      </Title>
      <div className="content-block mt-[60px]">
        <div className="ml-[26px]">
          <div className="flex items-center gap-3 mb-5">
            <p className="text-xl font-roboto text-[#1B1B30]">Розсилки за</p>
            <button type="button" onClick={handleClick}>
              <Image src="/svg/excel.svg" alt="Excel icon" width={42} height={42} />
            </button>
          </div>
          <BackStatisticsBtn>
            <p>Повернутись до статистики за день</p>
          </BackStatisticsBtn>
          <div className="flex mb-10 text-xl font-roboto text-[#1B1B30]">
            <div className="mr-8">
              <p className="mb-4">Відправник</p>
              <p className="mb-4">Статус розсилки</p>
              <p>Назва групи</p>
            </div>
            <div className="mr-28 font-montserrat text-lg">
              <p className="mb-4 text-[#2366E8]">
                {userHistoryDetails[0] ? userHistoryDetails[0]?.user_name : '-'}
              </p>
              <p className="mb-4">Відіслано</p>
              <p>Україна</p>
            </div>
            <div>
              <p className="mb-4">Текст sms</p>
              <p className="mr-28 font-montserrat text-base">
                {userHistoryDetails[0] ? userHistoryDetails[0]?.text_sms : '-'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[100px] h-[58px] px-[26px] font-roboto text-[20px] text-white bg-[#417D8A]">
          <p className="w-[166px]">Номер телефону</p>
          <p className="w-[196px]">Дати відправки</p>
          <p className="w-[130px]">Кількість sms</p>
          <p className="w-[130px]">Статус</p>
        </div>

        <ul>
          {userHistoryDetails &&
            userHistoryDetails.length !== 0 &&
            userHistoryDetails.map(item => {
              return (
                <li
                  key={item.client_id}
                  className="flex items-center gap-[100px] h-[47px] px-[26px] font-roboto text-l text-black border-b border-[#B5C9BE]"
                >
                  <p className="w-[166px]">{item.tel}</p>
                  <p className="w-[196px]">
                    {new Date(item.sending_group_date).toLocaleString('uk-UA', { timeZone: 'UTC' })}
                  </p>
                  <p className="w-[130px]">{item.recipient_status.length}</p>
                  <p className="w-[130px]">
                    {item.recipient_status.every(item => item === 'fullfield')
                      ? 'Доставлено'
                      : 'Недоставлено'}
                  </p>
                </li>
              );
            })}

          {(!userHistoryDetails || userHistoryDetails.length < 3) &&
            Array.from({ length: 3 - userHistoryDetails.length }).map((_, index: number) => {
              return (
                <li
                  key={index}
                  className="flex items-center justify-between h-[47px] px-[26px] font-roboto text-lg text-black border-b border-[#B5C9BE]"
                ></li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}
