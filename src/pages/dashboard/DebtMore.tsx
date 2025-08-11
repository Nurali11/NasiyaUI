import { MoreOutlined } from '@ant-design/icons'
import Header from '../../components/Header'
import { Heading, Text } from '../../components'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from '../../hooks/instance'
import toast from 'react-hot-toast'
import type { DebtType } from '../../@types/SingleDebtor'
import { Popover, Skeleton } from 'antd'
import { formatNumber } from '../../hooks/formatNumber'
import { API } from '../../hooks/getEnv'
import { useState } from 'react'
import CustomModal from '../../components/Modal'
import img from '../../assets/images/img.png'
import CustomButton from '../../components/Button'

const DebtMore = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [modal, setModal] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false);
  const {data: debt, isLoading} = useQuery<DebtType>({
        queryKey: ['debt-more'],
        queryFn: () => instance.get(`/debt/${id}`).then(res => res.data).catch(err => {return toast.error(err.response.data.message)}),
    })

    console.log(debt);
    

  const content = (
        <div className="w-[172px] px-[5px]">
            <Text classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] !pt-[6px] !pb-[10px] border-[#ECECEC]">Tahrirlash</Text>
            <Text onClick={() => {setModal(true); setPopoverOpen(false)}} classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer !pt-[10px] !pb-[6px] !text-[#F94D4D]">O‘chirish</Text>
        </div>
    )
    
  return (
    <div className='containers space-y-[30px]'>
      {isLoading ? <Skeleton.Node active style={{width: '380px', marginTop: '30px', height: '40px'}}/> : 
        <div className='sticky z-10 top-0'> 
            <Header title='Batafsil'/>
            <Popover className="" open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)} placement="bottomRight" content={content} trigger="click">
                    <button className="absolute z-10 top-[30px] right-0 duration-300 hover:scale-[1.1] cursor-pointer"><MoreOutlined className="scale-[1.2]"/></button>
            </Popover>
        </div>
      }

        <div className='space-y-[24px]'>
          <div className='flex gap-[20px]'>
            <div className='w-[70%] space-y-[5px]'>
              <Heading classList='!text-[16px] !font-sans !font-medium' tag='h3'>Sana</Heading>
              <div className='bg-[#F6F6F6]  flex justify-between border-[1.5px] border-[#ECECEC] rounded-[5px] py-[8px] px-[12px]'>{debt?.startDate}<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 16.6667V5.00008C17.5 4.08091 16.7525 3.33341 15.8333 3.33341H14.1667V1.66675H12.5V3.33341H7.5V1.66675H5.83333V3.33341H4.16667C3.2475 3.33341 2.5 4.08091 2.5 5.00008V16.6667C2.5 17.5859 3.2475 18.3334 4.16667 18.3334H15.8333C16.7525 18.3334 17.5 17.5859 17.5 16.6667ZM7.5 15.0001H5.83333V13.3334H7.5V15.0001ZM7.5 11.6667H5.83333V10.0001H7.5V11.6667ZM10.8333 15.0001H9.16667V13.3334H10.8333V15.0001ZM10.8333 11.6667H9.16667V10.0001H10.8333V11.6667ZM14.1667 15.0001H12.5V13.3334H14.1667V15.0001ZM14.1667 11.6667H12.5V10.0001H14.1667V11.6667ZM15.8333 7.50008H4.16667V5.83341H15.8333V7.50008Z" fill="#3478F7"/></svg></div>
            </div>
            
            <div className='w-[30%] space-y-[5px]'>
              <Heading classList='!text-[16px] !font-sans !font-medium' tag='h3'>Sana</Heading>
              <div className='bg-[#F6F6F6] border-[1.5px] border-[#ECECEC] rounded-[5px] py-[8px] px-[12px]'>{debt?.createdAt.split('T')[1].substring(0, 5)}</div>
            </div>
          </div>
          <div className='space-y-[5px]'>
              <Heading classList='!text-[16px] !font-sans !font-medium' tag='h3'>Muddat</Heading>
            <div className='bg-[#F6F6F6] flex justify-between border-[1.5px] border-[#ECECEC] rounded-[5px] py-[8px] px-[12px]'>{debt?.period} oy</div>
          </div>
          <div className='space-y-[5px]'>
              <Heading classList='!text-[16px] !font-sans !font-medium' tag='h3'>Summa miqdori</Heading>
            <div className='bg-[#F6F6F6] flex justify-between border-[1.5px] border-[#ECECEC] rounded-[5px] py-[8px] px-[12px] '>{formatNumber(debt?.remainedSum)} <span className='!font-semibold !font-sans'>so‘m</span></div>
          </div>
          <div className='space-y-[5px]'>
              <Heading classList='!text-[16px] !font-sans !font-medium' tag='h3'>Eslatma</Heading>
            <div className={`bg-[#F6F6F6] h-[130px] overflow-scroll hide-scroll flex justify-between border-[1.5px] border-[#ECECEC] rounded-[5px] py-[8px] px-[12px] `}>{debt?.comment}</div>
          </div>
          <div className='space-y-[5px]'>
              <Heading classList='!text-[16px] !font-sans !font-medium' tag='h3'>Rasm Biriktirish </Heading>
              <div className='flex gap-[10px] flex-wrap'>
                {/* @ts-ignore */}
                {debt?.nasiyaImages.map((item) => (<img className="rounded-[15px] w-[45%] h-[110px]" src={`${API}uploads/${item.image}`}  onError={(e) => { e.target.src = img }} width={100} height={110} alt=""/>))}
              </div>
          </div>
          <CustomButton onClick={() => {navigate("sondirish"); queryClient.invalidateQueries({queryKey: ["debt-sondirish"]})}} isDisabled={false} classList='!mt-[10px]'>Nasiyani so‘ndirish</CustomButton>
        </div>
        {modal && <CustomModal url={`/debt/${debt?.id}`} open={modal} setOpen={setModal}/>}
    </div>
  )
}

export default DebtMore