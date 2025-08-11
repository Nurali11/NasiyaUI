import { NavLink } from "react-router-dom";
import { DebtorIcon, HomeIcon, PaymentIcon, SettingIcon } from "../assets/icons";
import { PATH } from "../hooks/path";

const Menu = () => {
  return (
    <div id="menu" className="border-t-[1px] h-[10%] border-t-[#ECECEC] p-[10px]">
      <div className="containers">
        <div className="flex items-center justify-between">
          <NavLink to={PATH.main} className="flex flex-col items-center justify-center space-y-[3px] text-[#637D92]">
            <HomeIcon />
            <p>Asosiy</p>
          </NavLink>
          <NavLink to={PATH.debtor} className="flex flex-col items-center justify-center space-y-[3px] text-[#637D92]">
            <DebtorIcon />
            <p>Mijozlar</p>
          </NavLink>
          <NavLink to={PATH.hisobot} className="flex flex-col items-center justify-center space-y-[3px] text-[#637D92]">
            <PaymentIcon />
            <p>Hisobot</p>
          </NavLink>
          <NavLink to={PATH.settings} className="flex flex-col items-center justify-center space-y-[3px] text-[#637D92]">
            <SettingIcon />
            <p>Sozlama</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Menu;
