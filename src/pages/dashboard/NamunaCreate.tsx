import { Text } from "../../components"
import { Input, Skeleton } from "antd"
import Header from "../../components/Header"
import TextArea from "antd/es/input/TextArea"
import { use, useEffect, useState } from "react"
import CustomButton from "../../components/Button"
import { instance } from "../../hooks/instance"
import { useCookies } from "react-cookie"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { PATH } from "../../hooks/path"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NamunaType } from "../../@types/NamunaType"

const NamunaCreate = () => {
    const [text, setText] = useState("")
    const {id} = useParams()
    const queryClient = useQueryClient()
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate()

    const { data, isLoading } = useQuery<NamunaType>({
  queryKey: ['namuna-update', id],
  queryFn: () => instance
    .get(`/sample/${id}`, {headers: { Authorization: `Bearer ${cookies.token}` }})
    .then(res => res.data.data)
    .catch(err => toast.error(err.response.data.message)),
  enabled: location.pathname.includes("/update") && !!id
});

useEffect(() => {
    if(data){
        console.log(data);
        
        setText(data.comment)
    }
}, [data])

    const CreateMutation = useMutation({
        mutationFn: () => instance.post("/sample", {comment: text}, {headers: { Authorization: `Bearer ${cookies.token}` }}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["namuna"]})
            toast.success("Namuna yaratildi!");
            navigate(PATH.namuna)
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Xatolik yuz berdi");
        }
    })

    const UpdateMutation = useMutation({
        mutationFn: () => instance.patch(`/sample/${id}`, {comment: text}, {headers: { Authorization: `Bearer ${cookies.token}` }}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["namuna"]})
            toast.success("Namuna tahrildi!");
            navigate(PATH.namuna)
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Xatolik yuz berdi");
        }
    })
    function handleClick(){
        if(id) return UpdateMutation.mutate()
        CreateMutation.mutate()
    }
  return (
    <div className="containers h-[89%]">
        <div className='border-b-[1px] border-b-[#d4d4d4] pb-[10px]'>
            <Header title={`Namuna ${id ? "Tahrirlash" : "Yaratish"}`}/>
        </div>
        {isLoading ? <Skeleton.Node active style={{width: "375px", height: "160px", marginTop: "20px", borderRadius: "10px" }} /> : (
            <>
                <div className="h-[100%] flex flex-col justify-between">
                    <div className="mt-[20px]">
                        <Text>Namuna</Text>
                        <TextArea value={text} onChange={(e) => setText(e.target.value)} autoSize={{minRows: 4, maxRows: 4}} placeholder="Matn yozish..." className="!p-[14px] min-h-[104px] !mt-[10px] hide-scroll resize-none"/>
                    </div>
                        <CustomButton isLoading={CreateMutation.isPending} classList="mb-[10px]" onClick={handleClick}>{id ? "Tahrirlash" : "Yaratish"}</CustomButton>
                </div>
            </>
        )}
    </div>
  )
}

export default NamunaCreate