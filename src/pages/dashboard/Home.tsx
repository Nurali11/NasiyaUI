import { CalendarIcon, CashIcon, PlusIcon } from "../../assets/icons";
import { Heading, Text } from "../../components";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { instance } from "../../hooks/instance";
import { formatNumber } from "../../hooks/formatNumber";
import { API } from "../../hooks/getEnv";
import type { SellerMeType } from "../../@types/SellerType";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { PATH } from "../../hooks/path";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const Home = () => {
  const [showLimit, setShowLimit] = useState<boolean>(false);
  const [cookies] = useCookies(["token"]);
  const { data: sellerData, isLoading } : {data: SellerMeType|undefined, isLoading: any} = useQuery({
    queryKey: ["get-seller"],
    queryFn: () =>
      instance
        .get("/seller/me", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data.data),
    refetchOnMount: false,
  });

  let totalDebt = 0

  for(let i of sellerData?.Nasiya || []) {
    totalDebt += i.remainedSum
  }

  return (
    <div className="containers !pt-[30px]">
      <div className="flex items-center justify-between mb-[38px]">
        <div className="flex gap-[15px] items-center">
          <div>
            {sellerData?.image ? <img
            className="rounded-full w-[40px] h-[40px]"
            src={`${API}uploads/${sellerData?.image}`}
            alt="Avatar img"
            width={40}
            height={40}
          /> : <Skeleton.Avatar active shape={'circle'}  size={40} />}
          

          </div>
          <strong className="font-semibold text-[16px]">
            {isLoading ? <Skeleton.Input active size={"default"} />: sellerData?.name}
          </strong>
        </div>
        <button
          className="bg-[#5F5F5] hover:!border-[#75CDB] calendar-button duration-300 !w-[40px] !text items-center justify-center !p-0 !rounded-[12px] !h-[40px]"
          onClick={() => {}}
        >
          {!sellerData ? <Skeleton.Node active style={{ width: 40, height: 40, borderRadius: 12}} /> : <Link to={PATH.kalendar}><div className="bg-[#F5F5F5] border-[2px] border-[#d9d5d5] cursor-pointer w-[40px] h-[40px] flex items-center rounded-[10px] justify-center text-[#735CD8]"><CalendarIcon /></div></Link> }
          
        </button>
      </div>

      {!sellerData ? <Skeleton.Node active style={{ width: 360, height: 90, marginBottom: 31, borderRadius: 20}} /> : <div className="rounded-[20px] flex justify-center items-center relative bg-[#30AF49] mb-[31px] py-[18px] text-center">
        <div className="flex flex-col">
          <strong className="font-bold text-white text-[20px]">
            {showLimit ? "*********" : `${isLoading ? `` : `${formatNumber(totalDebt)} so‘m`}`}
          </strong>
          <Text classList="!text-[#F6F6F6B2] !text-[14px]">Umumiy nasiya:</Text>
        </div>
        <button
          onClick={() => setShowLimit(!showLimit)}
          className="absolute cursor-pointer duration-300 hover:scale-[1.2] top-0 bottom-0 my-auto right-[22px]"
        >
          <div className="!text-[22px] !text-white">{showLimit ? <EyeInvisibleOutlined /> : <EyeOutlined />}</div>
        </button>
      </div>}
      
      <div className="flex justify-between mb-[40px]">
        {!sellerData ? <Skeleton.Node active style={{ width: 160, height: 120, borderRadius: 16}} /> : <div className="p-[16px] w-[48%] border-[1px] border-[#ECEC] rounded-[16px]">
          <div className="w-[110px] space-y-[20px]">
            <Text classList="!font-semibold !text-[18px]">Kechiktirilgan to‘lovlar</Text>
            <Text classList="!text-[18px] !text-[#F94D4D]">{sellerData?.Nasiya.length}</Text>
          </div>
        </div>}

        {!sellerData ? <Skeleton.Node active style={{ width: 160, height: 120, borderRadius: 16}} /> : <div className="p-[16px] w-[48%] border-[1px] border-[#ECEC] rounded-[16px]">
          <div className="w-[110px] space-y-[20px]">
            <Text classList="!font-semibold !text-[18px]">Mijozlar soni <br /> <br /></Text>
            <Text classList="!text-[18px] !text-[#30AF49]">{sellerData?.Debtor.length}</Text>
          </div>
        </div>}

      </div>

      {!sellerData ? <Skeleton.Node active style={{ width: 360, height: 150, borderRadius: 16}}/>: 
      <>
      <div className="mb-[20px]">
        <Heading tag="h2" children="Hamyoningiz" classList="!text-[18px] !font-semibold !mb-[20px]"/>
        <div className="flex justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="bg-[#735CD81A] w-[50px] h-[50px] flex items-center justify-center rounded-full"><CashIcon/></div>
            <div className="text-start">
              <Text classList="!text-[16px]">Hisobingizda</Text>
              <Heading tag="h2" children={`${formatNumber(sellerData?.balance)} so'm`} classList="!font-bold !text-[24px]"/>
            </div>
        </div>
            <div className="bg-[#3478F7] w-[40px] h-[40px] cursor-pointer rounded-full flex items-center justify-center"><PlusIcon/></div>
        </div>
      </div>
      <div className="flex justify-between">
        <Text classList="text-[14px] !font-medium">Bu oy uchun to'lov</Text>
        <Text classList="text-[14px] !font-semibold text-[#30AF49]">To'lov qilingan</Text>
      </div>
      </>}

    </div>
  );
};

export default Home;