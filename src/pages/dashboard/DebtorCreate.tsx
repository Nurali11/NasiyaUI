import { Button, Form, Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import { Text } from "../../components";
import UploadImg from "../../components/Upload";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CustomButton from "../../components/Button";
import { instance } from "../../hooks/instance";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../hooks/path";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SingleDebtorType } from "../../@types/SingleDebtor";

const DebtorCreate = () => {
  const {id} = useParams();
  const [cookies] = useCookies(["token"]);
  const [phones, setPhones] = useState([""]);
  const [showComment, setShowComment] = useState(false);
  const [imgNames, setImgNames] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<SingleDebtorType | null>(null);
  const navigate = useNavigate();

  const { data } = useQuery<SingleDebtorType>({
  queryKey: ['single-debtor', id],
  queryFn: () => instance
    .get(`/debtor/${id}`)
    .then(res => res.data)
    .catch(err => toast.error(err.response.data.message)),
  enabled: location.pathname.includes("/update") && !!id
});

useEffect(() => {
  if (data) {
    const phoneList = data.Phone.map((item: any) => item.phone);
    setPhones(phoneList);
    setImgNames(data.Images.map((item: any) => item.image));
    setEditData(data);
    form.setFieldsValue({
      fullname: data.name,
      address: data.address,
      phoneNumbers: phoneList,
      comment: data.comment,
      images: data.Images.map((item: any) => item.image),
    });
  }
}, [data, form]);

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
    validateForm();
  };

  const validateForm = async () => {
    try {
      await form.validateFields().catch((err) => console.log(err));
      setIsFormValid(true);
    } catch (error) {
      setIsFormValid(false)
    }
  };

  const handleFormChange = () => {
    validateForm();
  };

  const onFinish = (values: any) => {
    const data = {
      fullname: values.fullname || "",
      address: values.address || "",
      phoneNumbers: values.phoneNumbers || [],
      comment: values.comment || "",
      images: imgNames || [],
    };
    console.log(data);
    
    instance.post("/debtor", data, {headers: {Authorization: `Bearer ${cookies.token}`,},}).then((_res) => { toast.success("Debtor Created!"); queryClient.invalidateQueries({ queryKey: ["debt-history"] }); navigate(PATH.debtor); }).catch((err) => {toast.error(err.response.data.message);});
  };

  return (
    <div className="containers !pt-[30px]">
      <Header title="Mijoz yaratish" />
      <Form
        form={form}
        name="create-debtor"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
        layout="vertical"
        onFinishFailed={(err) => console.log("Error validation:", err)}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          name="fullname"
          rules={[{ required: true, message: "Iltimos ismini kiriting" }]}
          label="Ism"
        >
          <Input placeholder="Ismini kiriting" />
        </Form.Item>

        <div className="!space-y-[8px]">
          {phones.map((_, index) => (
            <Form.Item
              key={index}
              name={["phoneNumbers", index]}
              rules={[{ required: true, message: "Iltimos telefon raqamini kiriting" }]}
              label={index === 0 ? "Telefon raqami" : ""}
            >
              <div className="flex items-center gap-2">
                <Input value={phones[index] ?? ""} onChange={(e) => { const newPhones = [...phones]; newPhones[index] = e.target.value; setPhones(newPhones); form.setFieldsValue({ phoneNumbers: newPhones }); }} placeholder="Telefon raqami" className="!flex-1"/>
                {index > 0 && (
                  <CloseCircleOutlined
                    onClick={() => removePhone(index)}
                    className="!text-[#d0cece] !text-[20px] cursor-pointer"
                  />
                )}
              </div>
            </Form.Item>
          ))}
        </div>

        <Text
          classList="!text-[15px] !text-[#3478F7] !text-end cursor-pointer block mb-3"
          onClick={() => {
            setPhones([...phones, ""]);
            validateForm(); 
          }}
        >
          +Ko'proq qo'shish
        </Text>

        <Form.Item name="address" label="Yashash manzili">
          <Input placeholder="Yashash manzilini kiriting" />
        </Form.Item>

        {!showComment && (
          <Form.Item>
            <Button
              type="default"
              className="w-full !text-[15px] !rounded-[10px] !h-[42px]"
              onClick={() => setShowComment(true)}
            >
              Eslatma qo'shish
            </Button>
          </Form.Item>
        )}

        {showComment && (
          <Form.Item name="comment">
            <Text onClick={() => setShowComment(!showComment)} classList='cursor-pointer mb-[5px  ]'>Eslatma</Text>
            <Input.TextArea
            defaultValue={editData?.comment || ""}
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
  );
};

export default DebtorCreate;