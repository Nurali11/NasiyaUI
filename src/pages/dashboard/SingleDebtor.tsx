import { useNavigate, useParams } from "react-router-dom"
import { Heading, Text } from "../../components"
import {  ArrowLeft, PlusIcon } from "../../assets/icons"
import { useCookies } from "react-cookie"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { instance } from "../../hooks/instance"
import toast from "react-hot-toast"
import type { NasiyaType, SingleDebtorType } from "../../@types/SingleDebtorType"
import { MoreOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { Button, Popover, Skeleton } from "antd"
import { formatNumber } from "../../hooks/formatNumber"
import { useState } from "react"
import CustomModal from "../../components/Modal"

const SingleDebtor = () => {
    const {id} = useParams()
    const queryClient = useQueryClient()
    const [_cookies] = useCookies()
    const [modal, setModal] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false);
    const navigate = useNavigate()
    const {data: singleDebtor, isLoading} = useQuery<SingleDebtorType>({
        queryKey: ['single-debtor', id],
        queryFn: () => instance.get(`/debtor/${id}`, {headers: { Authorization: `Bearer ${_cookies.token}` }}).then(res => res.data).catch(err => {return toast.error(err.response.data.message)}),
    })
    
    const content = (
        <div className="w-[172px] px-[5px]">
            <Text onClick={() => navigate("update")} classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] !pt-[6px] !pb-[10px] border-[#ECECEC]">Tahrirlash</Text>
            <Text onClick={() => {setModal(true); setPopoverOpen(false)}} classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer !pt-[10px] !pb-[6px] !text-[#F94D4D]">O‘chirish</Text>
        </div>
    )

    const emptyPage = (
        <div className="w-[270px] text-center ">
            <Text classList="!font-bold !text-[16px]">Mijozda hali nasiya mavjud emas</Text>
            <Text classList="w-[250px] !text-[14px] !text-black/30">Nasiya yaratish uchun pastdagi “+” tugmasini bosing</Text>
        </div>
    )

    function findPercent(nasiya: NasiyaType){
        const remainedMonths = nasiya.period - nasiya.PaidMonths.length
        const percent = (remainedMonths / nasiya.period) * 100
        return percent
    }

    const { mutate: updateStar } = useMutation({
  mutationFn: (data: { id: string; star: boolean }) =>
    instance.patch(`/debtor/${data.id}`, { star: data.star }, {headers: {Authorization: `Bearer ${_cookies.token}`,}}),

  onMutate: async (data) => {
    await queryClient.cancelQueries({ queryKey: ["single-debtor", id] })
    const previousData = queryClient.getQueryData(["single-debtor", id])
    queryClient.setQueryData(["single-debtor", id], (old: any) =>
      old ? { ...old, star: data.star } : old
    )

    return { previousData }
  },

  onError: (err, variables, context) => {
    queryClient.setQueryData(["single-debtor", id], context?.previousData)
    toast.error("Xatolik yuz berdi")
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["single-debtor", id] })
    queryClient.invalidateQueries({ queryKey: ["debt-history"] })
  },
})

    function getDateAndTime(startDate: string, ISO: string) {
  const monthsUz = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun","Iyl", "Avg", "Sentabr", "Oktabr", "Nov", "Dek"];

  const [day, month, year] = startDate.split(".");
  
  const hours = String(ISO.split("T")[1].split(":")[0]).padStart(2, "0");
  const minutes = String(ISO.split("T")[1].split(":")[1]).padStart(2, "0");

  return `${monthsUz[Number(month) - 1]} ${day}, ${year} ${hours}:${minutes}`;
}
    return (
    <div className='containers !pt-[30px] space-y-[20px] !h-[100%]'>
        {isLoading ? <div>
            <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "50px", borderRadius: "16px" }}/>
            <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "50px", borderRadius: "16px" }}/>
        </div>  : 
        <div className='flex sticky justify-between z-10 top-[1px] bg-white'>
            <div className="flex gap-[15px]">
                <div onClick={() => navigate(-1)} className='cursor-pointer'><ArrowLeft/></div>
                <Heading classList='!text-[18px] !font-semibold' tag='h2' children={singleDebtor?.name}/>
            </div>
            <div className="flex gap-[20px]">
                <button onClick={(e) => {e.stopPropagation();updateStar({ id: singleDebtor?.id || "0" , star: !singleDebtor?.star })}} className="cursor-pointer">{singleDebtor?.star ? <StarFilled className="!text-[#FFA800] !text-[20px]" /> : <StarOutlined className="!text-[#b5b5b5] !text-[20px]" />}</button>
                <Popover className="" open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)} placement="bottomRight" content={content} trigger="click">
                    <button className="duration-300 hover:scale-[1.1] cursor-pointer"><MoreOutlined className="scale-[1.2]"/></button>
                </Popover>
            </div>
        </div>}
        
        {isLoading ? <div>
            <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>
            <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>
            <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "143px", borderRadius: "16px" }}/>
        </div> :
        <div className="space-y-[25px] h-[80%]">
            <div className="space-y-[20px]">
                <div className="bg-[#BBD2FC] rounded-[20px] w-full px-[16px] py-[18px]">
                    <Text classList="!text-[14px] !font-normal">Umumiy nasiya:</Text>
                    <Heading tag="h2" classList="!font-bold !text-[22px]">{formatNumber(singleDebtor?.total)} <span className="!font-normal !text-[18px]">so‘m</span></Heading>
                </div>
                <Heading tag="h2" classList="!font-semibold !text-[18px] mb-[15px]">Faol nasiyalar</Heading>
            </div>
            <div  className="h-[80%]">
                <div className="space-y-[15px] overflow-auto">
                    {singleDebtor?.Nasiya.length || 0 > 0 ? singleDebtor?.Nasiya.map((item: NasiyaType) => (
                        <div onClick={() => {navigate(`/debt/${item.id}`); queryClient.invalidateQueries({ queryKey: ["debt-more"] })}} key={item.id} className="bg-[#F6F6F6] cursor-pointer rounded-[18px] p-[16px] space-y-[10px]">
                            <div className="flex justify-between">
                                <Text classList="!text-[18px]" >{getDateAndTime(item.startDate, item.createdAt)}</Text>
                                <Text classList="!font-semibold !text-[18px] !text-[#3478F7]">{formatNumber(item.remainedSum)} <span className="!font-medium">so‘m</span></Text>
                            </div>
                            <div>
                                <Text classList="!text-[15px]  !font-normal">Keyingi to‘lov: {item?.PaidMonths.length > 0 ? item.PaidMonths[0].endDate : "-------"}</Text>
                                <Text classList="!text-[#735CD8] !text-[20px] !font-bold">{item.PaidMonths.length > 0 ? formatNumber(item.PaidMonths[0].sum) : "-------"}<span className="!text-[#726C6C] !text-[15px] !font-medium pl-[2px]">so‘m</span></Text>
                                <div className="w-full h-[10px] mt-[15px] rounded-[50px] relative bg-[#CCCCCC]">
                                    <div style={{width: `${findPercent(item)}%`}} className="h-[10px] rounded-[50px] bg-[#30AF49] absolute"></div>
                                </div>
                            </div>
                        </div>
                    )) : (<div className="flex justify-center items-center h-[50%]">{emptyPage}</div>)}
                </div>
            </div>
        </div>
        }
        {modal && <CustomModal title={singleDebtor?.Nasiya.length || 0 > 0 ? `Bu mijozning ${singleDebtor?.Nasiya.length || 0} ta nasiyasi bor.O‘chirishni tasdiqlaysizmi?`  : "O‘chirishni tasdiqlaysizmi"} url={`/debtor/${singleDebtor?.id}`} open={modal} setOpen={setModal} queryKey="debt-history"/>}
        
            <Button onClick={() => {
                navigate(`debtCreate`)
            }} className="!bg-[#3478F7] !text-white absolute !bottom-[10px] left-[60%] !z-10 !text-[18px] !h-[50px] !rounded-[10px] !font-semibold !px-[20px]" icon={<PlusIcon />}>
                Qoshish
            </Button>   
    </div>
  )
}

export default SingleDebtor