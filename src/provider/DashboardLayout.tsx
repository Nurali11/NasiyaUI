import type { ReactNode } from "react"
import { Menu } from "../modules"

const DashboardLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className="h-[100vh] w-[400px] relative rounded-[30px]">
      <div className="h-[90%] overflow-auto hide-scroll">
        {children}
      </div>
      <Menu/>
    </div>
  )
}

export default DashboardLayout