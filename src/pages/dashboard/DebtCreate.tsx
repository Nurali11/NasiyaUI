import { Button, DatePicker, Form, Input, Select, type DatePickerProps } from 'antd'
import Header from '../../components/Header'
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckedIcon } from '../../assets/icons';
import { Text } from '../../components';
import dayjs from 'dayjs';
import CustomButton from '../../components/Button';
import UploadImg from '../../components/Upload';
import { instance } from '../../hooks/instance';
import toast from 'react-hot-toast';

const DebtCreate = () => {
  const {id} = useParams()
  const [cookies] = useCookies(["token"]);
  const [checked, setChecked] = useState(false)
  const [comment, setComment] = useState("")
  const [form] = Form.useForm();
  const [date, setDate] = useState("")
  const [imgNames, setImgNames] = useState<string[]>([]);
  const [showComment, setShowComment] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); 
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
    const validateForm = async () => {
    try {
      await form.validateFields().catch((err) => console.log(err)
      );
      setIsFormValid(true)
    } catch (error) {
      setIsFormValid(false); 
    }
  };

  const onFinish = (values: any) => {
    const data = {
      name: values.name || "",
      sum: +values.sum.replace(/\s/g, "") || 0,
      startDate: date || "",
      period: +values.period || 0,
      debtorId: id || "",
      comment: comment || "",
      images: imgNames || [],
    }
    instance.post("/debt", data, {headers: { Authorization: `Bearer ${cookies.token}`,},}).then((_res) => { toast.success("Nasiya muvaffaqiyatli yaratildi!"); queryClient.invalidateQueries({ queryKey: ["single-debtor"] }); navigate(-1);}).catch((err) => {  toast.error("Xatolik yuz berdi: " + err.response.data.message);});
  }

  const onChange: DatePickerProps['onChange'] = (date) => {
    if(dayjs(date).format("DD.MM.YYYY") == dayjs().format("DD.MM.YYYY")){
      setChecked(true)
    }else if(date != dayjs()){
      setChecked(false) 
    }
    setDate(dayjs(date).format("DD.MM.YYYY"))
};

  return (
    <div className='containers !pt-[30px]'>
        <Header title='Nasiya yaratish'/>
         <Form form={form} name="create-debtor" initialValues={{ remember: true }} style={{ maxWidth: 360 }} onFinish={onFinish} layout="vertical" onFinishFailed={(err) => console.log("Error validation:", err)} onValuesChange={validateForm}>
        <Form.Item name="name" label="Mahsulot nomi" rules={[{ required: true, message: "Iltimos nomini kiriting" }]}> 
            <Input className='!bg-[#F6F6F6]' placeholder="Ismini kiriting" />
        </Form.Item>

        <Form.Item name="sum" label="Mahsulot narxi" rules={[{ required: true, message: "Iltimos narxini kiriting" }]}> 
            <Input className='!bg-[#F6F6F6]' type='text' formEncType='number' onChange={(e) => { if(e.target.value[0] == "0"){ e.target.value = e.target.value.slice(1)} const digits = e.target.value.replace(/\D/g, ""); form.setFieldsValue({sum: digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ")})}} placeholder="Narxini kiriting" />
        </Form.Item>

        <div className="flex justify-center items-center gap-[20px]">
            <Form.Item className="w-[80%] date !text-[30px]" name="date" label="Sana" rules={[{ required: true, message: "Iltimos sanani kiriting" }]}>
                <DatePicker className="w-[100%] " placeholder="Sanani kiriting" onChange={onChange}/>
            </Form.Item>

            <div onClick={() => { setChecked(!checked); !checked ? form.setFieldsValue({ date: dayjs() }) : form.setFieldsValue({ date: null })}} className="flex gap-[8px] cursor-pointer items-center justify-center">
                <div className={`${ checked ? "border-[#30AF49]" : "border-[#dedbdb]" } flex items-center justify-center rounded-[5px] border-[2px] w-[20px] h-[20px]`}>
                    {checked ? (<div className="mt-[2px]"><CheckedIcon /></div>) : ("")}
                </div>
                <Text>Bugun</Text>
            </div>
        </div>

        <Form.Item label="Muddat" name="period" rules={[{ required: true, message: "Iltimos muddatni kiriting" }]}>
            <Select placement='bottomRight' className='flex items-center justify-center' dropdownStyle={{ width: 200 }} placeholder="Qarz muddatni kiriting" options={[{value: "1", label: "1 oy"}, {value: "2", label: "2 oy"}, {value: "3", label: "3 oy"}, {value: "4", label: "4 oy"}, {value: "5", label: "5 oy"}, {value: "6", label: "6 oy"}, {value: "7", label: "7 oy"}, {value: "8", label: "8 oy"}, {value: "9", label: "9 oy"}, {value: "10", label: "10 oy"}, {value: "11", label: "11 oy"}, {value: "12", label: "12 oy"}]}></Select>
        </Form.Item>

        {!showComment && (
          <Form.Item>
            <Button
              type="default"
              className="w-full !text-[15px] cursor-pointer !rounded-[10px] !h-[42px]"
              onClick={() => setShowComment(!showComment)}
            >
              Eslatma qo'shish
            </Button>
          </Form.Item>
        )}

        {showComment && (
            // @ts-ignore
          <Form.Item  name="comment" >
            <Text onClick={() => {setShowComment(!showComment); setComment("")}} classList='cursor-pointer mb-[5px]'>Eslatma</Text>
            <Input.TextArea
            onChange={(e) => setComment(e.target.value)}
              placeholder="Kommentariya"
              autoSize={{ minRows: 3, maxRows: 3 }}
              style={{ resize: "none" }}
            />
          </Form.Item>
        )}

        <Form.Item label="Rasm biriktirish">
          <UploadImg setImgNames={setImgNames} />
        </Form.Item>

        <Form.Item>
          <CustomButton type="submit" isDisabled={!isFormValid}>
            Saqlash
          </CustomButton>
        </Form.Item>
</Form>
    </div>
  )
}

export default DebtCreate