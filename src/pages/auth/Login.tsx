import { Logo } from "../../assets/images"
import Heading from "../../components/Heading"
import Text from "../../components/Text"
import LoginForm from "../../components/Form"

const login = () => {
  return (
    <div className="containers relative !pt-[90px] h-[100vh]">
      <img className=" mb-[32px]" src={Logo} alt="Logo" width={40} height={40} />
      <Heading tag="h1" classList="!mb-[12px]">Dasturga kirish</Heading>
      <Text classList="!mb-[20px]">Iltimos, tizimga kirish uchun login va parolingizni kiriting.</Text>
      <LoginForm/>
      <Text classList="absolute bottom-0 bottom-text !font-normal !pb-[10px]">Hisobingiz yo'q bo'lsa, tizimga kirish huquqini olish uchun <span className="text-[#3478F7] border-b-[1px] border-b-[#3478F7] cursor-pointer">do'kon administratori</span>  bilan bog'laning.</Text>
    </div>
  )
}

export default login