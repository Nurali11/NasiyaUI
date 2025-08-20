import { useEffect, useState, type ReactNode } from "react"
import { Menu } from "../modules"
import { useLocation } from "react-router-dom";

const DashboardLayout = ({children}:{children:ReactNode}) => {
    const location = useLocation();
  const [showMenu, setShowMenu] = useState(true);
  useEffect(() => {
    const arr = ["/debtor/", "/debt/", "/kalendar","/hisobot/message", "/namuna"]
    console.log(location.pathname);
    
    for (let i of arr) {
      if (location.pathname.includes(i)) {
        setShowMenu(false);
        return
      }
    }
    setShowMenu(true);
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