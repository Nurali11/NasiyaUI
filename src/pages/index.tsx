import { lazy } from "react"
import LoginHome from "./auth/Home"
import Home from "./dashboard/Home"

const Login = lazy(() => new Promise((resolve:any) => {
    resolve(import("./auth/Login"))
    return setTimeout(() => resolve(import("./auth/Login")), 1500)
}))

export {Login, Home, LoginHome}