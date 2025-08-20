import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Header from "../../components/Header"
import { instance } from "../../hooks/instance"
import { useCookies } from "react-cookie"
import { API } from "../../hooks/getEnv"
import type { SellerMeType } from "../../@types/SellerType"
import { ImgEditIcon } from "../../assets/icons"
import { Text } from "../../components"
import { Skeleton, Upload, type UploadProps } from "antd"
import { useState } from "react"
import toast from "react-hot-toast"
import loadingImg from "../../assets/images/loading.png"

const Shaxsiy = () => {
    const [{token}] = useCookies(['token']);
    const queryClient = useQueryClient();
    const [loading, setIsLoading] = useState(false);
    const {data, isLoading} = useQuery<SellerMeType>({
        queryKey: ['user', token],
        queryFn: () => instance.get('/seller/me', {headers: { Authorization: `Bearer ${token}` }}).then(res => res.data.data)
    })
    console.log(data);

    const { mutate } = useMutation({
    mutationFn: (image: string) => instance.patch(`/seller/${data?.id}`, { image }, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", token] });
      queryClient.invalidateQueries({ queryKey: ["get-seller"] });
      setIsLoading(false);
      toast.success("Muvaffaqiyatli o'zgartirildi");
    },
    onError: (err) => {
      setIsLoading(false);
      toast.error(err?.message || "Xatolik yuz berdi!");
    },
  });

    const handleUpload: UploadProps["onChange"] = ({ file }) => {
    setIsLoading(true);
    if (file.status == "done") {
      mutate(file.response.filename);
    }
    if (file.status == "error") {
      toast.error("file is too large");
    }
  };
    
  return (
    <div className='containers '>
        {isLoading ? (<div className="mt-[30px] flex flex-col justify-center items-center gap-[20px]">
            <Skeleton.Node active style={{width: '350px', height: "40px", borderRadius:"10px"}}/>
            <Skeleton.Node active style={{width: '100px', height: "100px", borderRadius:"50%"}}/>
            <div className="space-y-[30px]">
                <Skeleton.Node active style={{width: '350px', height: "60px", borderRadius:"10px"}}/>
                <Skeleton.Node active style={{width: '350px', height: "60px", borderRadius:"10px"}}/>
                <Skeleton.Node active style={{width: '350px', height: "60px", borderRadius:"10px"}}/>
            </div>

        </div>) : (
            <div>
                <Header title="Shaxsiy ma'lumotlar"/>
                <div className="flex flex-col items-center justify-center space-y-[30px] mt-[20px]">
                    <label className="relative cursor-pointer">
                        <Upload action={`${API}file`} listType="picture-card" onChange={handleUpload} showUploadList={false}/>
                        <img className="rounded-full w-[100px] h-[100px]" src={`${API}uploads/${data?.image}`} alt="" />
                        <div className="absolute bottom-0 right-0 bg-white rounded-full z-10 w-[30px] h-[30px] flex items-center justify-center">
                            <ImgEditIcon/>
                        </div>
                        <span className={`absolute ${loading ? "bg-black/30 rounded-full" : ""} top-0 left-0 w-full h-full flex items-center justify-center`}>{loading && <img src={loadingImg} width={30} height={30}/>}</span>
                    </label>
                    <div className="space-y-[30px] w-full">
                        <div>
                            <Text classList="!font-semibold">Ismi familiya</Text>
                            <div className="bg-[#F6F6F6] flex justify-between border-[1.5px] border-[#ECECEC] rounded-[10px] py-[8px] px-[12px]">{data?.name}</div>
                        </div>
                        <div>
                            <Text classList="!font-semibold">Telefon raqam</Text>
                            <div className="bg-[#F6F6F6] flex justify-between border-[1.5px] border-[#ECECEC] rounded-[10px] py-[8px] px-[12px]">{data?.phone}</div>
                        </div>
                        <div>
                            <Text classList="!font-semibold">Elektron pochta</Text>
                            <div className="bg-[#F6F6F6] flex justify-between border-[1.5px] border-[#ECECEC] rounded-[10px] py-[8px] px-[12px]">{data?.email}</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Shaxsiy