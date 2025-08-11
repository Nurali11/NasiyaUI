import { useState } from "react"
import { HisobotIcon, NotSendIcon } from "../../assets/icons"
import { Heading, Text } from "../../components"
import { useQuery } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import type { MessagesType } from "../../@types/Message";

const Hisobot = () => {
    const getMonth = (date: string) => {
  const [year, month, day] = date.split("T")[0].split("-");
  const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
  return day + " " + monthNames[+month - 1];
}

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

  return (
    <div className='containers !pt-[30px] space-y-[20px]'>
        <div className="flex justify-between items-center px-[15px] border-b-[2px] border-b-[#ECECEC] pb-[10px]">
            <Heading tag="h2" classList="!text-[20px] !font-bold" children={"Hisobot"}/>
            <div className="cursor-pointer"><HisobotIcon/></div>
        </div>
        <div className="">
            <div className="mx-[10px] p-[6px] flex rounded-[10px] bg-[#F6F6F6] justify-between items-center">
                <div onClick={() => setSelected("xabarlar")} className={`w-[340px] ${selected === "xabarlar" && "!text-[#3478F7] bg-white"} text-[#1A1A1ACC] cursor-pointer rounded-[10px] px-[20px] py-[7px]`}>
                    <Text classList="!text-[16px]">Xabarlar tarixi</Text>
                </div>
                <div onClick={() => setSelected("tolovlar")} className={`w-[340px] ${selected === "tolovlar" && "!text-[#3478F7] bg-white"} text-[#1A1A1ACC] cursor-pointer rounded-[10px] px-[20px] py-[7px]`}>
                    <Text classList="!text-[16px]">To‘lovlar tarixi</Text>
                </div>
            </div>
        </div>
        <div className="mx-[10px]">
            {selected === "xabarlar" && (
                <div>
                    {!isLoading && messages?.map((item: MessagesType) => (
                        <div key={item.id} className="flex justify-between items-center border-b-[1.5px] border-b-[#c5c5c5] py-[15px]">
                            <div className="space-y-[5px]">
                                <Heading tag="h2">{item.name}</Heading>
                                <Text classList="!text-black/70">{item.Phone[0].phone}</Text>
                            </div>
                            <div className="space-y-[5px] flex flex-col items-end">
                                <Text classList="!text-black/60">{getMonth(item.Message.length > 0 ? item.Message[0].createdAt : item.createdAt)}</Text>
                                {item.Message.length > 0 && !item.Message[0].isSend ? <NotSendIcon/> : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selected === "tolovlar" && (
                <div></div>
            )}
        </div>
    </div>
  )
}

export default Hisobot