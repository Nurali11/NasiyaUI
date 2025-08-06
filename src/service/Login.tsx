import toast from "react-hot-toast"
import { instance } from "../hooks/instance"

export const Login = (data: {username: string, password: string}, setCookies:any, setLoading: any) => {
    instance.post("/seller/login", data).then(res => {
        setTimeout(() => {
            setLoading(false)
            toast.success("Logged In")
            setCookies("token", res.data.token)
            location.pathname = "/"
        }, 700)
    }).catch(err => {
        setTimeout(() => {
            toast.error(err.response.data.message)
            setLoading(false)
        }, 80)
    })
}