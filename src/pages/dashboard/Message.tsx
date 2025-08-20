import { useQuery, useQueryClient } from "@tanstack/react-query"
import Header from "../../components/Header"
import { instance } from "../../hooks/instance"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import { useCookies } from "react-cookie"
import type { MessagesType, SingleMessageType } from "../../@types/MessageType"
import { Heading, Text } from "../../components"
import { useEffect, useRef, useState } from "react"
import { Input, Popover, Skeleton, Switch } from "antd"
import { CloseOutlined, MoreOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import "dayjs/locale/en"
import { HisobotIcon, NotSendIcon, SendIcon } from "../../assets/icons"
import CustomModal from "../../components/Modal"
dayjs.locale("uz")

const Message = () => {
    const {id} = useParams()
    const [cookies] = useCookies(['token'])
    const [message, setMessage] = useState("")
    const queryClient = useQueryClient()
    const [modalOpen, setModalOpen] = useState(false)
    const [showSample, setShowSample] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    let { data, isLoading } = useQuery<MessagesType>({
        queryKey: ['message', id],
        queryFn: () => instance.get(`/debtor/${id}`, {headers:{ Authorization: `Bearer ${cookies.token}`}}).then((res: any) => res.data).catch((err: any) => {if (err.response?.status === 401) {toast.error(err.response.data.message)}})
})

const {data: Samples} = useQuery<SingleMessageType[]>({
    queryKey: ['samples'],
    queryFn: () => instance.get("/sample/my", {headers: { Authorization: `Bearer ${cookies.token}` }}).then((res) => res.data).catch((err) => {if (err.response?.status === 401) {toast.error(err.response.data.message)}})
})


function handleMessage(e: any) {
    e.preventDefault()
    const data = {
        debtorId: id,
        text: message
    }
    console.log(data);
    instance.post("/message", data, {headers: { Authorization: `Bearer ${cookies.token}`}}).then((_res: any) => {setMessage(""); queryClient.invalidateQueries({ queryKey: ["message"]}); queryClient.invalidateQueries({ queryKey: ["messages"]});}).catch((err: any) => {toast.error(err.response.data.message)})
}

let sortedMessages = data?.Message.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
console.log(sortedMessages);

useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
  }
}, [sortedMessages])

const content = (
        <div className="w-[172px] px-[5px]">
            <Text classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] !pt-[6px] !pb-[10px] border-[#ECECEC]">Tahrirlash</Text>
            <Text onClick={() => {setModalOpen(true); setPopoverOpen(false)}} classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer !pt-[10px] !pb-[6px] !text-[#F94D4D]">O‘chirish</Text>
        </div>
    )

    console.log(data);
    
  return (
    <>
    {isLoading ? 
    <>
    <Skeleton.Node active style={{width: "375px", borderRadius:"16px", marginBottom:"20px", marginTop:"20px", height: "50px"}}/>
    <Skeleton.Node active style={{width: "375px", borderRadius:"16px", marginBottom:"20px", height: "150px"}}/>
    <Skeleton.Node active style={{width: "375px", borderRadius:"16px", marginBottom:"20px", height: "150px"}}/>
    <Skeleton.Node active style={{width: "375px", borderRadius:"16px", marginBottom:"20px", height: "150px"}}/>
    </> : (<><div className="containers h-[88%]">
          <div className='sticky z-10 top-0 border-b-[1px] border-b-[#ECECEC] pb-[10px]'> 
              <Header title={data?.name || ""}/>
              <Popover className="" open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)} placement="bottomRight" content={content} trigger="click">
                      <button className="absolute z-10 top-[30px] right-0 duration-300 hover:scale-[1.1] cursor-pointer"><MoreOutlined className="scale-[1.2]"/></button>
              </Popover>
          </div>
          <div className="flex flex-col justify-between h-[100%]">
    <div
      ref={messagesEndRef}
      className="flex flex-col space-y-[15px] overflow-auto hide-scroll pb-[10px]"
    >
      {sortedMessages?.map((message: SingleMessageType, index) => {
        const currentDate = dayjs(message.createdAt).format("YYYY-MM-DD")
        const prevDate = index > 0 ? dayjs(sortedMessages[index - 1].createdAt).format("YYYY-MM-DD") : null
        const showDateHeader = index === 0 || currentDate !== prevDate

        return (
          <div key={message.id} className="w-full flex flex-col">
            {showDateHeader && (
              <div className="text-center text-gray-500 text-sm my-3">
                {dayjs(message.createdAt).format("DD MMMM")}
              </div>
            )}
            <div className="flex justify-end px-[15px]"> 
              <div className="p-4 bg-[#F5F5F5] w-[350px] rounded-[16px] flex flex-col items-end space-y-[10px]">
                {message.text}
                <div className="flex justify-end items-center mt-[5px] gap-[5px]">
                    <div className="text-gray-400 text-xs">
                      {dayjs(message.createdAt).format("HH:mm")}
                    </div>
                  
                  {!message.isSend && (
                    <div className="flex items-center justify-center">
                      <NotSendIcon/>
                      <Text classList="!text-[#F94D4D] !text-[14px]">Yuborilmadi</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>

    <div className="border-t-[1px] border-t-[#c6c3c3] py-[8px] gap-[10px] px-[15px] flex flex-col justify-center items-center">
      <form onSubmit={handleMessage} className="relative w-full">
        <div className="flex items-center gap-[10px]">
          <div onClick={() => setShowSample(!showSample)} className="cursor-pointer"><HisobotIcon/></div>
          <Input value={message} name="message" onChange={(e) => setMessage(e.target.value)} className="!rounded-[50px] !h-[50px] !border-none !pr-[45px]" placeholder="Xabar yuborish..."/>
        </div>
        {message.length > 0 && (
          <button type="submit" className="absolute cursor-pointer top-[50%] right-[15px] translate-y-[-50%]">
            <SendIcon/>
          </button>
        )}
      </form>
        {showSample && (
          <div className="relative">
            <div className="flex gap-[15px] absolute z-10">
              <CloseOutlined onClick={() => setShowSample(false)} className="cursor-pointer"/>
              <Heading tag="h2">Namuna</Heading>
            </div>
            {Samples?.length || 0 > 0 ? (
              <div className="space-y-[10px] mt-[23px] max-h-[200px] overflow-auto hide-scroll">
                {Samples?.filter((item: any) => item.isActive).map((item: any) => (
                  <div onClick={() => {setMessage(item.comment); setShowSample(false)}} key={item.id} className='bg-[#F5F5F5] cursor-pointer rounded-[16px] p-[15px]'>
                    <div className='flex justify-between items-center'>
                        <Switch size='small' defaultChecked={item.isActive} disabled/>
                        <div></div>
                    </div>
                    <Text classList='!pt-[10px]'>{item.comment}</Text>
                </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-[10px]">
                <Text classList="!text-[#F94D4D]">Sizda hali namunalar yo‘q</Text>
              </div>
            )}
          </div>
        )}
    </div>
  </div>
</div></>)}
          {modalOpen && <CustomModal url={`/message/deleteChat/${id}`} open={modalOpen} queryKey="debt-more" setOpen={setModalOpen}/>}
    </>
  )
}

export default Message