import { CloseOutlined } from "@ant-design/icons"
import Heading from "./Heading"
import { formatNumber } from "../hooks/formatNumber";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../hooks/instance";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { DebtType } from "../@types/SingleDebtorType";
import Text from "./Text";
import CustomButton from "./Button";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { CheckedIcon, DoneIcon } from "../assets/icons";

export const getMonth = (date: string) => {
    const [_day, month, _year] = date.split(".");
    const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    return monthNames[+month - 1];
}

const SondirishModal = ({type, setModal}: {type: "next" | "any" | "months", setModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const {id} = useParams()
    const [cookies] = useCookies(["token"]);
    const [amount, setAmount] = useState("");
    const [err, setErr] = useState("");
    const [done, setDone] = useState(false);
    const [show, setShow] = useState(false);
    const queryClient = useQueryClient();
    const [months, setMonths] = useState<{ period: number; sum: number }[]>([]);

    const heading = {
        next: "1 oy uchun so‘ndirish",
        any: "Har qanday miqdorda so‘ndirish",
        months: "To‘lov muddatini tanlang"
    }

    useEffect(() => {
    const t = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(t);
  }, []);

    const {data: item} = useQuery<DebtType>({
        queryKey: ['debt-sondirish'],
        queryFn: () => instance.get(`/debt/${id}`, {headers: { Authorization: `Bearer ${cookies.token}` }}).then(res => res.data).catch(err => {return toast.error(err.response.data.message)}),
    })

    function handlePayment() {
        let data:any = {
            debtId: id
        }
        if(type == "next"){
            instance.post("/payments/one-month-pay", data, {headers: { Authorization: `Bearer ${cookies.token}`,},}).then((res) => { setDone(true); queryClient.invalidateQueries()}).catch((err) => {  toast.error("Xatolik yuz berdi: " + err.response.data.message);});
        }else if(type == "any"){
            data.amount = +amount.replace(/\s/g, "")
            instance.post("/payments/pay-any-sum", data, {headers: { Authorization: `Bearer ${cookies.token}`,},}).then((_res) => {setDone(true); queryClient.invalidateQueries()}).catch((err) => {  toast.error("Xatolik yuz berdi: " + err.response.data.message);});
        }else if(type == "months"){
            data.monthsToPay = months.map((item) => item.period)
            instance.post("/payments/pay-for-months", data, {headers: { Authorization: `Bearer ${cookies.token}`,},}).then((res) => {setDone(true); queryClient.invalidateQueries()}).catch((err) => {  toast.error("Xatolik yuz berdi: " + err.response.data.message);});
        }
    }

    const closeModal = () => {
    setShow(false);
    setTimeout(() => setModal(false), 300);
  };

    function handleAmount(e: any) {
        let rem = item?.remainedSum || 0
        let val = +e.target.value.replace(/\s/g, "")
        if(val > rem ){
            setAmount(String(rem))
            setErr("Kiritilgan summa kerakli sumdan oshmasligi kerak")
        }else{
            setErr("")
            setAmount(e.target.value.replace(/\D/g, "").replace(/^0+/, "").replace(/\B(?=(\d{3})+(?!\d))/g, " "))
        }
    }

    const nextContent = (
        <div className="flex flex-col justify-between h-[85%]">
            <div className="bg-[#DDE9FE] w-full py-[15px] flex flex-col rounded-[15px] px-[15px] items-start justify-center">
                <Text classList="!font-semibold !text-[18px] !text-[#3478F7]">{formatNumber(item?.NotPaidMonths[0].sum)} <span className="!font-medium !font-sans">so‘m</span></Text>
                <Text>{getMonth(item?.NotPaidMonths[0].endDate || "")} oyi uchun so‘ndiriladi</Text>
            </div>
            <CustomButton onClick={handlePayment} >1 oylik uchun so‘ndirish</CustomButton>
        </div>
    )
    const anyContent = (
        <div className="flex flex-col justify-between h-[85%]">
            <div className="space-y-[5px]">
                <Text classList="!font-medium !font-sans !text-[15px]">Miqdorni kiriting *</Text>
                <Input className='!bg-[#F6F6F6]' type='text' value={amount} onChange={handleAmount} placeholder="Summa kiriting" />
                <Text classList="!text-red-500">{err}</Text>
            </div>
            <div>
                <CustomButton onClick={handlePayment}>So‘ndirish</CustomButton>
            </div>
        </div>
    )

const toggleMonth = (m: any) => {
  setMonths(prev =>prev.find(x => x.period === m.period) ? prev.filter(x => x.period !== m.period): [...prev, { period: m.period, sum: m.sum }]);
};

const selectAll = () => {
  if (months.length === item?.NotPaidMonths.length) {
    setMonths([]);
  } else {
    // @ts-ignore
    setMonths(item?.NotPaidMonths.map((m: any) => ({ period: m.period, sum: m.sum })));
  }
};

const monthsContent = (
    <div className="flex flex-col  justify-between h-[90%]">
        <div className="">
            <div className="flex justify-between items-center border-b-[1px] border-b-[#b8b6b6] pb-[15px]">
            <div>
                <Text classList="!font-medium">So‘ndirish:</Text>
                <Text classList="!font-semibold !text-[16px] !text-[#3478F7]">
                {months.reduce((acc, cur) => acc + cur.sum, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00 so‘m
                </Text>
            </div>
            <Text classList="!text-[#3478F7] cursor-pointer !font-bold" onClick={selectAll}>Hammasini tanlang</Text>
            </div>
            <div className="space-y-[5px] max-h-[330px] overflow-auto hide-scroll">
                {item?.NotPaidMonths.map((item: any) => {
                const isChecked = months.some(x => x.period === item.period);
                return (
                    <div key={item.period} className="flex justify-between items-center py-[10px] border-b border-[#ECECEC]">
                    <div>
                        <Text classList="!text-[13px]">{item.period}-oy</Text>
                        <Text classList="!text-[14px] !font-semibold">{item.endDate}</Text>
                    </div>
                    <div className="flex gap-[10px]" >
                        <div className="!font-semibold">{item.sum} so'm</div>
                        <div onClick={() => toggleMonth(item)} className={`${isChecked ? "border-[#30AF49]" : "border-[#dedbdb]" } flex items-center cursor-pointer justify-center rounded-[5px] border-[2px] w-[20px] h-[20px]`}>
                        {isChecked && <div className="mt-[2px]"><CheckedIcon /></div>}
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
        </div>
            <div>
                <CustomButton onClick={handlePayment}>So‘ndirish</CustomButton>
            </div>
    </div>

);

const donePage = (
    <div className={`fixed z-[11] inset-0 bg-white backdrop-blur-[4px] flex flex-col items-center justify-center transition-opacity duration-300${show ? "opacity-100" : "opacity-0"}`}>
        <div className="flex flex-col items-center space-y-[10px]">
            <DoneIcon/>
            <Heading tag="h2" classList="!font-bold !text-[20px] !text-[#3478F7]">Ajoyib</Heading>
            <Text classList="!text-black/80">Muvaffaqiyatli so‘ndirildi</Text>
        </div>
        <CustomButton classList="!w-[360px] mt-[100px]" onClick={closeModal}>Bosh sahifa</CustomButton>
    </div>
) 



    
    return (
        <div className="relative">
        {done ? donePage : 
            <div className={`fixed z-[11] inset-0 backdrop-filter bg-black/40 backdrop-blur-[4px] flex items-end justify-center transition-opacity duration-300${show ? "opacity-100" : "opacity-0"}`}>
                <div className={`bg-white space-y-[30px] ${type == "months" ? "h-[550px]" : "h-[400px]"}  w-[400px] rounded-t-[20px] relative p-[20px]  transform transition-all duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}>
                    <div onClick={closeModal} className="bg-white cursor-pointer rounded-full absolute w-[40px] h-[40px] flex items-center justify-center top-[-50px] !text-[20px] right-0">
                        <CloseOutlined />
                    </div>
                    <Heading tag="h1" classList="!font-bold !text-[20px]" children={heading[type]} />
                    {type === "next" && nextContent}
                    {type === "any" && anyContent}
                    {type === "months" && monthsContent}
                </div>
            </div>
        }
        </div>
  )
}

export default SondirishModal