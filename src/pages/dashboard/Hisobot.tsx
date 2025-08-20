import { useState } from "react"
import { HisobotIcon, NotSendIcon } from "../../assets/icons"
import { Heading, Text } from "../../components"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import type { MessagesType } from "../../@types/MessageType";
import { useNavigate } from "react-router-dom";
import type { PaymentsHistoryType } from "../../@types/PaymentHistoryType";
import dayjs from "dayjs";
import { formatNumber } from "../../hooks/formatNumber";
import img from "../../assets/images/notFound.png"
import { Image, Skeleton } from "antd";

const Hisobot = () => {
    const queryClient = useQueryClient()
    const getMonth = (date: string) => {
  const [year, month, day] = date.split("T")[0].split("-");
  const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
  return day + " " + monthNames[+month - 1];
}
    const navigate = useNavigate()
    const [selected, setSelected] = useState<"xabarlar" | "tolovlar">("xabarlar");
    const [cookies] = useCookies(['token']);
    let { data: messages, isLoading } = useQuery<MessagesType[]>({
  queryKey: ['messages'],
  queryFn: () =>
    instance
      .get("/message/myMessages", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        const data: MessagesType[] = res.data;
        return data.sort((a, b) => {
          const aHasMsg = a.Message.length > 0;
          const bHasMsg = b.Message.length > 0;
          if (aHasMsg && bHasMsg) {
            const aLatest = new Date(a.Message[0].createdAt).getTime();
            const bLatest = new Date(b.Message[0].createdAt).getTime();
            return bLatest - aLatest; //
          } else if (!aHasMsg && !bHasMsg) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else {
            return aHasMsg ? -1 : 1;
          }
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
        return [];
      }),
});

    const notFound = (
      <div className="flex flex-col justify-center items-center">
        <img src={img} alt="" />
        <Text classList="!text-[16px] !font-semibold">Ma’lumot yo‘q</Text>
      </div>
    )
    let {data: payments} = useQuery<PaymentsHistoryType[]>({
      queryKey: ["payment-history"],
      queryFn: () => instance.get("/payments", {headers: { Authorization: `Bearer ${cookies.token}` }}).then(res => res.data).catch(err => {toast.error(err?.response?.data?.message || "Xatolik yuz berdi")}),
    })

    let sortedPayment = payments?.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
    
    console.log(messages, sortedPayment);
    
  return (
    <div className='containers !pt-[20px] space-y-[20px]'>
        <div className="flex justify-between items-center px-[15px] border-b-[2px] border-b-[#ECECEC] pb-[10px]">
            <Heading tag="h2" classList="!text-[20px] !font-bold" children={"Hisobot"}/>
            <div onClick={() => navigate("/namuna")} className="cursor-pointer"><HisobotIcon/></div>
        </div>
        <div className="">
            <div className="mx-[10px] duration-300 p-[6px] flex rounded-[10px] bg-[#F6F6F6] justify-between items-center">
                <div onClick={() => setSelected("xabarlar")} className={`w-[340px] ${selected === "xabarlar" && "!text-[#3478F7] bg-white"} text-[#1A1A1ACC] duration-300 cursor-pointer rounded-[10px] px-[20px] py-[7px]`}>
                    <Text classList="!text-[16px]">Xabarlar tarixi</Text>
                </div>
                <div onClick={() => setSelected("tolovlar")} className={`w-[340px] ${selected === "tolovlar" && "!text-[#3478F7] bg-white"} text-[#1A1A1ACC] duration-300 cursor-pointer rounded-[10px] px-[20px] py-[7px]`}>
                    <Text classList="!text-[16px]">To‘lovlar tarixi</Text>
                </div>
            </div>
        </div>
        {isLoading ? (<div className="mt-[10px] ">
          <Skeleton.Node active style={{width: "350px", height: "100px",  borderBottom: "1px solid #c5c5c5", padding: "10px"}}/>
          <Skeleton.Node active style={{width: "350px", height: "100px",  borderBottom: "1px solid #c5c5c5", padding: "10px"}}/>
          <Skeleton.Node active style={{width: "350px", height: "100px",  borderBottom: "1px solid #c5c5c5", padding: "10px"}}/>
          <Skeleton.Node active style={{width: "350px", height: "100px",  borderBottom: "1px solid #c5c5c5", padding: "10px"}}/>
        </div>) : 
        (
        <div className="mx-[10px]">
            {selected === "xabarlar" && (
                <div>
                    {messages?.length ? messages?.map((item: MessagesType) => (
                        <div key={item.id} onClick={() => {navigate(`message/${item.id}`); queryClient.invalidateQueries({queryKey: ['message', item.id]})}} className="flex justify-between cursor-pointer items-center border-b-[1.5px] border-b-[#c5c5c5] py-[15px]">
                            <div className="space-y-[5px]">
                                <Heading tag="h2">{item.name}</Heading>
                                <Text classList="!text-black/70">{item.Phone[0].phone}</Text>
                            </div>
                            <div className="space-y-[5px] flex flex-col items-end">
                                <Text classList="!text-black/60">{getMonth(item.Message.length > 0 ? item.Message[0].createdAt : item.createdAt)}</Text>
                                {item.Message.length > 0 && !item.Message[0].isSend ? <NotSendIcon/> : null}
                            </div>
                        </div>
                    )) : notFound}
                </div>
            )}
            {selected === "tolovlar" && (
                <div>
                    {sortedPayment?.map((item: PaymentsHistoryType, index: number) => (
                      <div key={item.id} className="flex flex-col justify-center items-center">
                        {index != 0 ? item.createAt.split("T")[0] != sortedPayment[index-1 >= 0 ? index-1 : 0].createAt.split("T")[0] ? (<div>
                            <Text classList="!text-[#3478F7] pb-[10px] pt-[15px]">{dayjs(item.createAt).format("DD.MM.YYYY")}</Text>
                        </div>) : null : (<Text classList="!text-[#3478F7] pb-[10px]">{dayjs(item.createAt).format("DD.MM.YYYY")}</Text>)}
                        {
                          <div className="flex justify-between w-full mx-[15px] pb-[10px] items-center border-b-[1px] border-b-[#ECECEC] mb-[15px]">
                            <div className="space-y-[5px]">
                              <Text classList="!font-bold">{item.Debtor.name}</Text>
                              <Text classList="!text-black/70 !text-[14px]">{item.Debtor.Phone[0].phone}</Text>
                            </div>
                            <Text classList="!font-semibold">-{formatNumber(item.amount)}</Text>
                          </div>
                        }
                      </div>
                    ))}
                </div>
            )}
        </div>
        )
        }
    </div>
  )
}

export default Hisobot