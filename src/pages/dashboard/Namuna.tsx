import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Header from '../../components/Header'
import { instance } from '../../hooks/instance'
import { useCookies } from 'react-cookie'
import toast from 'react-hot-toast'
import { Text } from '../../components'
import type { NamunaType } from '../../@types/NamunaType'
import { Popover, Switch } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import CustomButton from '../../components/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomModal from '../../components/Modal'
import { PATH } from '../../hooks/path'

const Namuna = () => {
    const [cookies] = useCookies(['token'])
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)
    const [modal, setModal] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: namuna } = useQuery<NamunaType[]>({
        queryKey: ['namuna'],
        queryFn: () =>
            instance
                .get('/sample/my', {
                    headers: { Authorization: `Bearer ${cookies.token}` },
                })
                .then((res) => res.data)
                .catch((err) => {
                    toast.error(err.response.data.message)
                    return []
                }),
    })

    const toggleMutation = useMutation({
        mutationFn: ({ id, checked }: { id: string; checked: boolean }) =>
            instance.patch(
                `/sample/${id}`,
                { isActive: checked },
                { headers: { Authorization: `Bearer ${cookies.token}` } }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['namuna']})
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Ошибка')
        },
    })

    function handleToggle(id: string, checked: boolean) {
        toggleMutation.mutate({ id, checked })
    }

    let empty = (
        <div className='text-center w-[340px]'>
            <Text classList='!font-bold'>Mavjud namunalar yo‘q</Text>
            <Text>
                <span className='!font-semibold'>“Qo‘shish”</span> tugmasi orqali namuna yarating
            </Text>
        </div>
    )

    function Content({id}: { id: string }) {
        return (
            <div className='w-[172px] px-[5px]'>
            <Text onClick={() => navigate(`${id}/update`)} classList='!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] !pt-[6px] !pb-[10px] border-[#ECECEC]'>
                Tahrirlash
            </Text>
            <Text onClick={() => {setModal(true)}} classList='!font-medium duration-300 hover:scale-[1.01] cursor-pointer !pt-[10px] !pb-[6px] !text-[#F94D4D]'>
                O‘chirish
            </Text>
            {modal && <CustomModal url={`/sample/${id}`} open={modal} setOpen={setModal} queryKey='namuna'/>}
        </div>
        )
    }

    return (
        <div className='containers h-[89%] '>
            <div className='border-b-[1px] border-b-[#d4d4d4] pb-[10px]'>
                <Header path={PATH.hisobot} title='Namuna' />
            </div>
            <div className='h-[100%] flex flex-col justify-between'>
                {namuna?.length ? (
                    <div className='pt-[20px] space-y-[10px] overflow-auto hide-scroll'>
                        {namuna.map((item: NamunaType) => (
                            <div key={item.id} className='bg-[#F5F5F5] rounded-[16px] p-[15px]'>
                                <div className='flex justify-between items-center'>
                                    <Switch size='small' defaultChecked={item.isActive} onChange={(checked) => handleToggle(item.id, checked)}/>
                                    <Popover open={openPopoverId === item.id} onOpenChange={(open) => setOpenPopoverId(open ? item.id : null) } placement='bottomRight' content={<Content id={item.id} />} trigger='click'>
                                        <button className='duration-300 hover:scale-[1.1] cursor-pointer'>
                                            <MoreOutlined className='scale-[1.2]' />
                                        </button>
                                    </Popover>
                                </div>
                                <Text classList='!pt-[10px]'>{item.comment}</Text>
                            </div>
                        ))}
                    </div>
                ) : ( <div className='h-[100%] flex justify-center items-center'>{empty}</div>)}
                <div className='sticky bottom-0'>
                    <CustomButton onClick={() => navigate('create')}>
                        <PlusOutlined />
                        Qo‘shish
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}

export default Namuna
