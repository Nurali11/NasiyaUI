import { Logo } from "../../assets/images"
import CustomButton from "../../components/Button"
import Heading from "../../components/Heading"
import Text from "../../components/Text"
import { Button, Input } from "antd"
import imgloading from "../../assets/images/loading.png"
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, MailOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { instance } from "../../hooks/instance"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { PATH } from "../../hooks/path"

const ForgetPassword = () => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [selected, setSelected] = useState<"email" | "verify" | "new">("email");
  const [password, setPassword] = useState("")  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [confirmPassword, setConfirmPassword] = useState("")
  const queryClient = useQueryClient()

  const ForgetMutation = useMutation({
    mutationFn: () => instance.post("/seller/forget", { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forget-password"] })
      setSelected("verify")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi")
    },
  })

  const VerifyMutation = useMutation({
    mutationFn: () => instance.post("/seller/verifyOtp", { email, otp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forget-password"] })
      setSelected("new")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi")
    },
  })

  const NewMutation = useMutation({
    mutationFn: () => instance.post("/seller/resetPassword", { email, newPassword: password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forget-password"] })
      toast.success("Parol muvaffaqiyatli o‘zgardi")
      location.pathname = PATH.login
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi")
    },
  })

  function handleForget(e: any) {
    e.preventDefault()
    ForgetMutation.mutate()
  }

  function handleVerify(e: any) {
    e.preventDefault()
    VerifyMutation.mutate()
  }

  function handleNew(e: any) {
    e.preventDefault()
    NewMutation.mutate()
  }

  useEffect(() => {
    if (selected === "verify" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [selected, timeLeft])

  return (
    <div>
      {selected == "email" && (
        <div className="containers relative !pt-[90px] h-[100vh]">
          <img className=" mb-[32px]" src={Logo} alt="Logo" width={40} height={40} />
          <Heading tag="h1" classList="!mb-[12px]">Dasturga kirish</Heading>
          <Text classList="!mb-[20px]">Iltimos, parolni ozgartish uchun emailingizni kiriting.</Text>
          <form onSubmit={handleForget} className="h-[20%] flex flex-col justify-between">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              prefix={<MailOutlined className="text-[20px] ml-[1px]" />}
              placeholder="Email"
            />
            <CustomButton isDisabled={!/^[\w._%+-]+@gmail\.com$/.test(email)}>
              {ForgetMutation.isPending ? <img src={imgloading} width={30} height={30} /> : "Parolni ozgartirish"}
            </CustomButton>
          </form>
        </div>
      )}

      {selected == "verify" && (
        <div className="containers relative !pt-[90px] h-[100vh]">
          <img className=" mb-[32px]" src={Logo} alt="Logo" width={40} height={40} />
          <Heading tag="h1" classList="!mb-[12px]">Dasturga kirish</Heading>
          <Text classList="!mb-[20px]">Iltimos, emailingizga yuborilgan 5 xonali kodni kiriting.</Text>
          <form onSubmit={handleVerify} className="flex flex-col items-center space-y-6">
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} prefix={<LockOutlined className="text-[20px] ml-[1px]"/>} placeholder="Otp"/>
                {timeLeft > 0 ? (
              <p className="text-gray-500">Qayta yuborishga: 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</p>
            ) : (
              <Button
                type="primary"
                onClick={() => {ForgetMutation.mutate(); setTimeLeft(60); setOtp("")}}
                className="text-[#30405c] !bg-[#474a4f]"
              >
                Qayta yuborish
              </Button>
            )}
            <CustomButton isDisabled={otp.length !== 5}>
              {VerifyMutation.isPending ? <img src={imgloading} width={30} height={30} /> : "Tasdiqlash"}
            </CustomButton>
          </form>
        </div>
      )}

      {selected == "new" && (
  <div className="containers relative w-[400px] !pt-[90px] h-[100vh]">
    <img className=" mb-[32px]" src={Logo} alt="Logo" width={40} height={40} />
    <Heading tag="h1" classList="!mb-[12px]">Dasturga kirish</Heading>
    <Text classList="!mb-[20px]">Iltimos, yangi parolni kiriting.</Text>
    <form onSubmit={handleNew} className="h-[30%] flex flex-col justify-between">
      
      <Input
        type={showPassword ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
        prefix={<LockOutlined className="text-[20px] ml-[1px]" />}
        suffix={
          showPassword ? (
            <EyeInvisibleOutlined
              onClick={() => setShowPassword(false)}
              className="cursor-pointer text-[18px]"
            />
          ) : (
            <EyeOutlined
              onClick={() => setShowPassword(true)}
              className="cursor-pointer text-[18px]"
            />
          )
        }
        placeholder="Yangi parol"
      />

      <Input
        type={showConfirm ? "text" : "password"}
        onChange={(e) => setConfirmPassword(e.target.value)}
        prefix={<LockOutlined className="text-[20px] ml-[1px]" />}
        suffix={
          showConfirm ? (
            <EyeInvisibleOutlined
              onClick={() => setShowConfirm(false)}
              className="cursor-pointer text-[18px]"
            />
          ) : (
            <EyeOutlined
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer text-[18px]"
            />
          )
        }
        placeholder="Yangi parolni tasdiqlash"
      />

      <CustomButton isDisabled={password.length < 1 || password !== confirmPassword}>
        {NewMutation.isPending ? <img src={imgloading} width={30} height={30} /> : "Parolni ozgartirish"}
      </CustomButton>
    </form>
  </div>
)}
    </div>
  )
}

export default ForgetPassword
