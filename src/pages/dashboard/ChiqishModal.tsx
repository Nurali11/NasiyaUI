import { useEffect, useState } from "react"
import { Button } from "antd"
import { ExitIcon } from "../../assets/icons"
import { Heading, Text } from "../../components"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

const ChiqishModal = ({ setModal }: { setModal: (v: boolean) => void }) => {
  const [show, setShow] = useState(false)
  const [cookies,,removeCookie] = useCookies(['token'])
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setShow(false) 
    setTimeout(() => setModal(false), 300)
  }

  const handleExit = () => {
    removeCookie('token')
    navigate('/')
  }

  return (
    <div className={`fixed z-[11] inset-0 backdrop-filter bg-black/40 backdrop-blur-[4px] flex items-end justify-center transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white transition-all duration-300 flex flex-col items-center w-[400px] h-[260px] rounded-t-[20px] relative p-[20px] transform ${show ? "translate-y-0" : "translate-y-full"}`}>
        <div className="pb-[15px]"><ExitIcon /></div>
        <Heading classList='!text-[20px] pb-[8px] !font-bold' tag='h2'>Hisobdan chiqish</Heading>
        <Text classList="pb-[40px]">Siz haqiqatan hisobdan chiqmoqchimisiz?</Text>
        <div className="flex items-center gap-[10px] justify-center">
          <Button onClick={handleExit} className="w-[150px] !h-[40px] !rounded-[10px]">
            <Text classList="text-[#3478F7]">Ha, chiqish</Text>
          </Button>
          <Button onClick={handleClose} className="w-[150px] !h-[40px] !rounded-[10px] !bg-[#F94D4D]" type="primary">Bekor qilish</Button> 
        </div>
      </div>
    </div>
  )
}

export default ChiqishModal
