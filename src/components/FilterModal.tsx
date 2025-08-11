import { Select, Radio } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useEffect, useRef } from "react"

const { Option } = Select

const FilterModal = ({ show, setShow, filterType, setFilterType, sortOrder, setSortOrder }: {
    show: boolean,
    setShow: (val: boolean) => void,
    filterType: string,
    setFilterType: (val: string) => void,
    sortOrder: string,
    setSortOrder: (val: string) => void
}) => {
    const filterRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInside = filterRef.current?.contains(target)
            const isDropdown = target.closest(".ant-select-dropdown")

            if (!isInside && !isDropdown) setShow(false)
        }

        if (show) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [show])

    if (!show) return null

    return (
        <div
            ref={filterRef}
            className="absolute top-[40px] right-0 z-50 bg-white p-3 rounded-md shadow-lg w-[220px] border"
        >
            <div className="flex justify-end mb-2">
                <CloseOutlined
                    className="text-gray-500 text-sm cursor-pointer"
                    onClick={() => setShow(false)}
                />
            </div>

            <div className="mb-3">
                <label className="text-[13px] text-gray-700 block mb-1">Saralash turi</label>
                <Select
                    value={filterType}
                    onChange={setFilterType}
                    className="w-full"
                    size="middle"
                    getPopupContainer={trigger => trigger.parentElement!}
                >
                    <Option value="name">Ism bo‘yicha</Option>
                    <Option value="total">Nasiya bo‘yicha</Option>
                </Select>
            </div>

            <div>
                <label className="text-[13px] text-gray-700 block mb-1">Saralash tartibi</label>
                <Radio.Group
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="flex gap-3"
                    size="small"
                >
                    <Radio value="asc">A-Z</Radio>
                    <Radio value="desc">Z-A</Radio>
                </Radio.Group>
            </div>
        </div>
    )
}

export default FilterModal
