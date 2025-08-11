import { Input } from "antd"

const Inputs = ({placeholder, classList, ...props}: {placeholder?: string, classList?: string, props?: any}) => {
  return (
    <Input {...props} placeholder={placeholder} className={`!bg-[#F6F6F6] !text-[16px] !py-[8px] !px-[12px] ${classList}`} />
  )
}

export default Inputs