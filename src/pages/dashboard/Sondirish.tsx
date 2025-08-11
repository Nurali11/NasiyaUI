import { RightOutlined } from "@ant-design/icons"
import { Heading, Text } from "../../components"
import Header from "../../components/Header"
import { useState } from "react";
import SondirishModal from "../../components/SondirishModal";

const Sondirish = () => {
  const [modal, setModal] = useState(false);
  const [type, setType] = useState<"next" | "any" | "months">("next");
  return (
    <div className="containers !pt-[30px] space-y-[20px]">
      <Header title='So‘ndirish'/>
      <Heading tag="h2" classList="!font-sans !font-semibold !text-[18px]" children='To‘lov'/>
      <div> 
        <div onClick={() => {setModal(true); setType("next")}} className="flex items-center justify-between h-[70px]   border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">1 oyga so‘ndirish</Text> <RightOutlined/></div>
        <div onClick={() => {setModal(true); setType("any")}} className="flex items-center justify-between h-[70px]   border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">Har qanday miqdorda so‘ndirish</Text> <RightOutlined/></div>
        <div onClick={() => {setModal(true); setType("months")}} className="flex items-center justify-between h-[70px]   border-b-[1px] border-b-[#d0d0d0] cursor-pointer"><Text classList="!text-[18px]">To‘lov muddatini tanlash</Text> <RightOutlined/></div>
      </div>
      {modal && <SondirishModal setModal={setModal} type={type}/>}
    </div>
  )
}

export default Sondirish