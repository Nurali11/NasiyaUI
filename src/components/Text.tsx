import type { FC } from "react"
import type { TextType } from "../@types/TextType"

const Text:FC<TextType> = ({classList, children, onClick}) => {
  return (
    <p onClick={onClick} className={`${classList} font-medium text-[16px]`}>{children}</p>
  )
}

export default Text