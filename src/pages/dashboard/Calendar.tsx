import { Heading, Text } from "../../components"
import { useState } from "react";
import type dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import CustomCalendar from "../../components/CustomCalendar";
import { FindMonth } from "../../hooks/findMonth";
import { formatNumber } from "../../hooks/formatNumber";
import Header from "../../components/Header";

const Calendar = () => {
    const [nowDate, setNowDate] = useState<dayjs.Dayjs | undefined>();
    const [,,removeCookies] = useCookies(['token']);
    const { data: debtsList, isLoading } = useQuery(({
        queryKey: ['debt-history', nowDate],
        queryFn: () => instance.get("/debt/date", {
          params: {
                endDate: nowDate ? `${((nowDate as any)?.$D).toString().padStart(2, '0')}.${((nowDate as any)?.$M + 1).toString().padStart(2, '0')}.${(nowDate as any)?.$y}` : 0
            }
        }).then(res => res.data).catch(err => {
            if (err.response.status == 401) {
                removeCookies("token")
                location.pathname = "/"
            }
        })
    }))

    return (
        <>
            <div className="containers mb-[44px]">
                <Header title="Kalendar"/>
                <CustomCalendar totalForMonth={isLoading ? "-----" : debtsList?.totalForMonth ? debtsList?.totalForMonth : 0} setNowDate={setNowDate} nowDate={nowDate} />
            </div>
            <div className="p-4 mt-[14px] bg-[#F6F6F6] rounded-[16px]">
                <div className="containers">
                    <Text classList="!mb-[20px]">{nowDate && (nowDate as any).$D} {FindMonth(nowDate && (nowDate as any).$M)} {debtsList?.data.length ? "kuni to‘lov kutilmoqda" : "kuni to‘lovlar mavjud emas"}</Text>
                    <div className="space-y-[5px]">
                        {isLoading ? "-----" : debtsList?.data.map((item: any) => (
                            <div key={item.id} className="bg-[#FFFFFF] cursor-pointer p-[14px] rounded-[16px]">
                                <Heading tag="h3">{item.Nasiya.Debtor.name}</Heading>
                                <Text classList="!font-normal">UZS {formatNumber(item.sum)}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calendar