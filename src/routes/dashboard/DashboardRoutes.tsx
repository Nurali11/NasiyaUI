import { Route, Routes } from "react-router-dom"
import { PATH } from "../../hooks/path"
import { Home } from "../../pages"
import DashboardLayout from "../../provider/DashboardLayout"
import Calendar from "../../pages/dashboard/Calendar"
import Debtor from "../../pages/dashboard/Debtor"
import DebtorCreate from "../../pages/dashboard/DebtorCreate"
import SingleDebtor from "../../pages/dashboard/SingleDebtor"
import DebtMore from "../../pages/dashboard/DebtMore"
import DebtCreate from "../../pages/dashboard/DebtCreate"
import Sondirish from "../../pages/dashboard/Sondirish"
import Hisobot from "../../pages/dashboard/Hisobot"
import Settings from "../../pages/dashboard/Settings"
import Message from "../../pages/dashboard/Message"
import Namuna from "../../pages/dashboard/Namuna"
import NamunaCreate from "../../pages/dashboard/NamunaCreate"
import Shaxsiy from "../../pages/dashboard/Shaxsiy"
import Yordam from "../../pages/dashboard/Yordam"
import ForgetPassword from "../../pages/dashboard/ForgetPassword"

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path={PATH.main} element={<Home />} />
        <Route path={PATH.kalendar} element={<Calendar />} />
        <Route path={PATH.debtor} element={<Debtor />} />
        <Route path={PATH.debtorCreate} element={<DebtorCreate />} />
        <Route path={PATH.debtorUpdate} element={<DebtorCreate />} />
        <Route path={PATH.singleDebtor} element={<SingleDebtor />} />
        <Route path={PATH.debtMore} element={<DebtMore/>} />
        <Route path={PATH.debtCreate} element={<DebtCreate/>} />
        <Route path={PATH.debtUpdate} element={<DebtCreate/>} />
        <Route path={PATH.debtSondirish} element={<Sondirish/>} />
        <Route path={PATH.hisobot} element={<Hisobot/>} />
        <Route path={PATH.namuna} element={<Namuna/>} />
        <Route path={PATH.namunaCreate} element={<NamunaCreate/>} />
        <Route path={PATH.namunaUpdate} element={<NamunaCreate/>} />
        <Route path={PATH.hisobotMessage} element={<Message/>} />
        <Route path={PATH.settings} element={<Settings/>} />
        <Route path={PATH.shaxsiy} element={<Shaxsiy/>} />
        <Route path={PATH.yordam} element={<Yordam/>} />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardRoutes