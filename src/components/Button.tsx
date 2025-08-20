import React from 'react'
import { Button as ButtonAnt } from 'antd'
import img from '../assets/images/loading.png'
const CustomButton = ({isDisabled, children, classList, onClick, isLoading}: {isDisabled?: boolean, children: React.ReactNode, classList?: string, type?: string, onClick?: () => void, isLoading?: boolean}) => {
  return (
    <ButtonAnt
          onClick={onClick}
          className={`!text-[18px] !h-[50px] !rounded-[10px] !py-[13px] ${isDisabled ? '!bg-[#DDE9FE] !border-none !text-white' : ''} ${classList}`}
          type="primary"
          htmlType={"submit"}
          block
          disabled={isDisabled || false}
        >{isLoading && (<img src={img} className="w-[20px] h-[20px]"/>)} {children}</ButtonAnt>
  )
}

export default CustomButton