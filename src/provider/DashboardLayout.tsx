import { useEffect, useState, type ReactNode } from "react"
import { Menu } from "../modules"
import { useLocation } from "react-router-dom";

const DashboardLayout = ({children}:{children:ReactNode}) => {
    const location = useLocation();
  const [showMenu, setShowMenu] = useState(true);
  useEffect(() => {
    const arr = ["/debtor/", "/debt/create"]

    if (arr.includes(location.pathname)) {
      setShowMenu(false);
    }else{
      setShowMenu(true)
    }
  }, [location]);

  return (
    <div className="h-[100vh] w-[400px] relative rounded-[30px]">
      <div className={`${showMenu ? "h-[90%]" : "h-[100%]"} main overflow-auto hide-scroll`}>
        {children}
      </div>
      {showMenu && <Menu/>}
    </div>
  )
}

export default DashboardLayout