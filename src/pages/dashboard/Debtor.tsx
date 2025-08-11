import { Input, Button, Skeleton } from "antd"
import { AddUserIcon, FilterIcon, SearchIcon } from "../../assets/icons"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { instance } from "../../hooks/instance"
import { Heading, Text } from "../../components"
import { StarFilled, StarOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import { formatNumber } from "../../hooks/formatNumber"
import FilterModal from "../../components/FilterModal"
import { useNavigate } from "react-router-dom"
import { PATH } from "../../hooks/path"

const Debtor = () => {
    const [searchValue, setSearchValue] = useState("")
    const [search, setSearch] = useState("")
    const [showFilter, setShowFilter] = useState(false)
    const [filterType, setFilterType] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchValue), 300)
        return () => clearTimeout(timer)
    }, [searchValue])

    let { data: debtorsList, isLoading } = useQuery({
        queryKey: ['debt-history'],
        queryFn: () =>
            instance.get("/debtor").then((res: any) => res.data.data).catch((err: any) => {
                if (err.response?.status === 401) {
                    toast.error(err.response.data.message)
                }
            })
    })

    const { mutate: updateStar } = useMutation({
        mutationFn: (data: {id: number, star: boolean}) => 
            instance.patch(`/debtor/${data.id}`, { star: data.star }),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['debt-history'] })
            const previousData = queryClient.getQueryData(['debt-history'])
            
            queryClient.setQueryData(['debt-history'], (old: any) => 
                old?.map((item: any) => 
                    item.id === data.id ? {...item, star: data.star} : item
                )
            )
            
            return { previousData }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['debt-history'], context?.previousData)
            toast.error("Xatolik yuz berdi")
        },
        onSuccess: () => {
            toast.success("Yulduzcha holati o'zgartirildi")
        }
    })

    if (search) {
        debtorsList = debtorsList?.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        )
    }
    if (filterType) {
        debtorsList = debtorsList?.sort((a: any, b: any) => {
            if (a[filterType] > b[filterType]) return sortOrder === "asc" ? 1 : -1
            if (a[filterType] < b[filterType]) return sortOrder === "asc" ? -1 : 1
            return 0
        })
    }
    function handleSingleDebtor(id: string){
    queryClient.invalidateQueries({queryKey: ["single-debtor"]})
    navigate(`${id}`)
  }

    return (
        <div className={`containers !pt-[30px] space-y-[30px] relative`}>
            <div className="flex justify-center items-center gap-[15px] relative">
                <Input
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="!bg-[#F6F6F6] !p-[10px] !font-medium !py-0 !text-[18px] !text-[#1A1A1A99]"
                    prefix={<SearchIcon />}
                    placeholder="Mijoz qidirish..."
                />

                <div className="relative">
                    <div className="cursor-pointer" onClick={() => setShowFilter(prev => !prev)}>
                        <FilterIcon />
                    </div>

                    <FilterModal
                        show={showFilter}
                        setShow={setShowFilter}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />
                </div>
            </div>

            <div className="space-y-[10px]">
                {isLoading ? <div>
                    <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>
                    <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>
                    <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>
                    <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>
                    <Skeleton.Node active style={{ width: "370px", marginBottom:"10px", height: "150px", borderRadius: "16px" }}/>  
                </div>  : debtorsList?.map((item: any) => (
                    <div key={item.id} onClick={() => handleSingleDebtor(item.id)} className="bg-[#F6F6F6] border-[2px] border-[#ECECEC] cursor-pointer p-[14px] rounded-[16px]">
                        <div className="space-y-[10px]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Heading classList="!text-[18px] !font-semibold" tag="h2">{item.name}</Heading>
                                    <Text classList="!text-[16px] !font-normal !text-[#7f7c7c]">
                                        {item.Phone[0].phone || "-----"}
                                    </Text>
                                </div>
                                <div onClick={() => updateStar({ id: item.id, star: !item.star })}>
                                    {item.star
                                        ? <StarFilled className="!text-[#FFA800] !text-[20px]" />
                                        : <StarOutlined className="!text-[#b5b5b5] !text-[20px]" />}
                                </div>
                            </div>
                            <div >
                                <Text classList="!text-[#817f7f] !text-[13px] !font-semibold">Jami nasiya:</Text>
                                <Heading classList="!text-[17px] !font-semibold !text-[#F94D4D]" tag="h2">
                                    -{formatNumber(item.total)} <span className="!text-[17px] !font-medium">so‘m</span>
                                </Heading>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={() => {
                navigate(PATH.debtorCreate)
            }} className="!bg-[#3478F7] !text-white !sticky !bottom-[10px] left-[100%] !z-10 !text-[18px] !h-[50px] !rounded-[10px] !font-semibold !px-[20px]" icon={<AddUserIcon />}>
                Yaratish
            </Button>
        </div>
    )
}

export default Debtor