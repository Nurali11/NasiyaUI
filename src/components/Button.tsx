import React from 'react'
import { Button as ButtonAnt } from 'antd'
const CustomButton = ({isDisabled, children, classList, onClick}: {isDisabled?: boolean, children: React.ReactNode, classList?: string, type?: string, onClick?: () => void}) => {
  return (
    <ButtonAnt
          onClick={onClick}
          className={`!text-[18px] !h-[50px] !rounded-[10px] !py-[13px] ${isDisabled ? '!bg-[#DDE9FE] !border-none !text-white' : ''} ${classList}`}
          type="primary"
          htmlType={"submit"}
          block
          disabled={isDisabled || false}
        >{children}</ButtonAnt>
  )
}

export default CustomButton