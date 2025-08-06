import { Route, Routes } from "react-router-dom"
import { PATH } from "../../hooks/path"
import { Login, LoginHome } from "../../pages"
import { Suspense } from "react"
import PageLoading from "../../components/PageLoading"
import { Toaster } from "react-hot-toast"

const AuthRoute = () => {
  return (
    <>
    <Toaster position="top-center"/>
    <Routes>
        <Route path={PATH.main} element={<LoginHome/>}/>
        <Route path={PATH.login} element={<Suspense fallback={<PageLoading/>}><Login/></Suspense>}/>
    </Routes>
    </>
  )
}

export default AuthRoute