import { Route, Routes } from "react-router-dom"
import { PATH } from "../../hooks/path"
import { Home } from "../../pages"
import DashboardLayout from "../../provider/DashboardLayout"
import Calendar from "../../pages/dashboard/Calendar"

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path={PATH.main} element={<Home />} />
        <Route path={PATH.kalendar} element={<Calendar />} />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardRoutes