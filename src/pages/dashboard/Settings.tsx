import { RightOutlined } from "@ant-design/icons"
import { Heading, Text } from "../../components"
import { useState } from "react"
import ChiqishModal from "./ChiqishModal"
import { useNavigate } from "react-router-dom"

const Settings = () => {
  const [showExit, setShowExit] = useState(false)
  const navigate = useNavigate()
  return (
    <div className='containers !pt-[30px] space-y-[20px]'>
      <Heading tag="h2" classList="!text-[20px] border-b-[2px] border-b-[#ECECEC] pb-[15px] !px-[15px]">Sozlamalar</Heading>
      <div className="space-y-[30px]">
        <div className="flex flex-col">
          <Text classList="text-[#3478F7]">Asosiy</Text>
          <div onClick={() => navigate("shaxsiy")} className="flex items-center justify-between h-[55px] border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Shaxsiy ma’lumotlar</Text> <RightOutlined/></div>
          <div className="flex items-center justify-between h-[55px] border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Xavfsizlik</Text> <RightOutlined/></div>
        </div>
        <div>
          <Text classList="text-[#3478F7]">Boshqa</Text>
          <div className="space-y-[15px]">
            <div onClick={() => navigate("yordam")} className="flex items-center justify-between h-[55px] border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Yordam</Text> <RightOutlined/></div>
            <div className="flex items-center justify-between h-[55px] border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Taklif va shikoyatlar</Text> <RightOutlined/></div>
            <div className="flex items-center justify-between h-[55px] border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Dastur haqida</Text> <RightOutlined/></div>
            <div className="flex items-center justify-between h-[55px] border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Maxfiylik siyosati</Text> <RightOutlined/></div>
            <Text onClick={() => setShowExit(true)} classList="!text-[#F94D4D] cursor-pointer">Chiqish</Text>
          </div>
        </div>
      </div>
      {showExit && <ChiqishModal setModal={setShowExit}/>}
    </div>
  )
}

export default Settings