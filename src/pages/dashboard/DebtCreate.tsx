import { Button, DatePicker, Form, Input, Select, type DatePickerProps } from 'antd';
import Header from '../../components/Header';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckedIcon } from '../../assets/icons';
import { Text } from '../../components';
import dayjs from 'dayjs';
import CustomButton from '../../components/Button';
import UploadImg from '../../components/Upload';
import { instance } from '../../hooks/instance';
import toast from 'react-hot-toast';
import type { DebtType } from '../../@types/SingleDebtorType';
import { formatNumber } from '../../hooks/formatNumber';

const DebtCreate = () => {
  const { id } = useParams();
  const [cookies] = useCookies(['token']);
  const [checked, setChecked] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [date, setDate] = useState('');
  const [imgNames, setImgNames] = useState<string[]>([]);
  const [showComment, setShowComment] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<DebtType | null>(null);
  const navigate = useNavigate();

  const { data } = useQuery<DebtType>({
    queryKey: ['single-debtor', id],
    queryFn: () =>
      instance
        .get(`/debt/${id}`, {headers: { Authorization: `Bearer ${cookies.token}` }})
        .then((res) => res.data)
        .catch((err) => toast.error(err.response.data.message)),
    enabled: location.pathname.includes('/update') && !!id,
  });
  let debtorId = data?.debtorId;

  useEffect(() => {
    if (data) {
      setEditData(data);
      const formattedDate = data.startDate ? dayjs(data.startDate, 'DD.MM.YYYY') : dayjs();
      setDate(formattedDate.format('DD.MM.YYYY'));
      setChecked(formattedDate.isSame(dayjs(), 'day'));

      form.setFieldsValue({
        name: data?.name || '',
        sum: formatNumber(data?.remainedSum) || 0,
        date: formattedDate,
        period: data?.period ? `${data.period}` : '1',
        comment: data?.comment || '',
        images: data?.nasiyaImages?.map((item: any) => item.image) || [],
      });
      setImgNames(data.nasiyaImages?.map((item: any) => item.image) || []);
    } else {
      form.setFieldsValue({
        date: dayjs(),
        period: '1',
      });
      setDate(dayjs().format('DD.MM.YYYY'));
      setChecked(true);
    }
  }, [data, form]);

  const validateForm = async () => {
    try {
      await form.validateFields();
      setIsFormValid(true);
    } catch (error) {
      setIsFormValid(false);
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data = {
      name: values.name || '',
      sum: values.sum ? +values.sum.replace(/\s/g, '') : 0,
      startDate: values.date ? dayjs(values.date).format('DD.MM.YYYY') : dayjs().format('DD.MM.YYYY'),
      period: values.period ? +values.period : 1,
      debtorId: id || '',
      comment: values.comment || '',
      images: imgNames || [],
    };
    setTimeout(() => {
      if(location.pathname.includes('/debtCreate')){
        return instance.post('/debt', data, {  headers: { Authorization: `Bearer ${cookies.token}` },}).then((_res) => {toast.success('Nasiya muvaffaqiyatli yaratildi!');queryClient.invalidateQueries({ queryKey: ['single-debtor'] });navigate(-1);}).catch((err) => {toast.error('Xatolik yuz berdi: ' + err.response.data.message);});
      }else{
        return instance.patch(`/debt/${id}`, {...data, debtorId}, {headers: { Authorization: `Bearer ${cookies.token}`}}).then((res) =>{toast.success('Nasiya muvaffaqiyatli tahrirlandi!');queryClient.invalidateQueries();navigate(-1);}).catch((err) => {toast.error('Xatolik yuz berdi: ' + err.response.data.message);});
      }
    }, 500)
};

  const onChange: DatePickerProps['onChange'] = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format('DD.MM.YYYY');
      setDate(formattedDate);
      setChecked(dayjs(date).isSame(dayjs(), 'day'));
      form.setFieldsValue({ date });
    } else {
      setDate('');
      setChecked(false);
      form.setFieldsValue({ date: null });
    }
  };

  console.log(imgNames);
  

  return (
    <div className="containers !pt-[30px]">
      <Header title="Nasiya yaratish" />
      <Form
        form={form}
        name="create-debtor"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
        layout="vertical"
        onFinishFailed={(err) => ""}
        onValuesChange={validateForm}
      >
        <Form.Item
          name="name"
          label="Mahsulot nomi"
          rules={[{ required: true, message: 'Iltimos nomini kiriting' }]}
        >
          <Input autoComplete='off' className="!bg-[#F6F6F6]" placeholder="Ismini kiriting" />
        </Form.Item>

        <Form.Item
          name="sum"
          label="Mahsulot narxi"
          rules={[{ required: true, message: 'Iltimos narxini kiriting' }]}
        >
          <Input
            className="!bg-[#F6F6F6]"
            type="text"
            onChange={(e) => {
              if (e.target.value[0] === '0') {
                e.target.value = e.target.value.slice(1);
              }
              const digits = e.target.value.replace(/\D/g, '');
              form.setFieldsValue({ sum: digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') });
            }}
            placeholder="Narxini kiriting"
          />
        </Form.Item>

        <div className="flex justify-center items-center gap-[20px]">
          <Form.Item
            className="w-[80%] date !text-[30px]"
            name="date"
            label="Sana"
            rules={[{ required: true, message: 'Iltimos sanani kiriting' }]}
          >
            <DatePicker className="w-[100%]" placeholder="Sanani kiriting" onChange={onChange} />
          </Form.Item>

          <div
            onClick={() => {
              setChecked(!checked);
              const newDate = checked ? null : dayjs();
              setDate(newDate ? newDate.format('DD.MM.YYYY') : '');
              form.setFieldsValue({ date: newDate });
            }}
            className="flex gap-[8px] cursor-pointer items-center justify-center"
          >
            <div
              className={`${
                checked ? 'border-[#30AF49]' : 'border-[#dedbdb]'
              } flex items-center justify-center rounded-[5px] border-[2px] w-[20px] h-[20px]`}
            >
              {checked ? (
                <div className="mt-[2px]">
                  <CheckedIcon />
                </div>
              ) : (
                ''
              )}
            </div>
            <Text>Bugun</Text>
          </div>
        </div>

        <Form.Item
          label="Muddat"
          name="period"
          rules={[{ required: true, message: 'Iltimos muddatni kiriting' }]}
        >
          <Select
            placement="bottomRight"
            className="flex items-center justify-center"
            dropdownStyle={{ width: 200 }}
            placeholder="Qarz muddatni kiriting"
            options={[
              { value: '1', label: '1 oy' },
              { value: '2', label: '2 oy' },
              { value: '3', label: '3 oy' },
              { value: '4', label: '4 oy' },
              { value: '5', label: '5 oy' },
              { value: '6', label: '6 oy' },
              { value: '7', label: '7 oy' },
              { value: '8', label: '8 oy' },
              { value: '9', label: '9 oy' },
              { value: '10', label: '10 oy' },
              { value: '11', label: '11 oy' },
              { value: '12', label: '12 oy' },
            ]}
          />
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
          <div>
            <Text
              onClick={() => {
                setShowComment(!showComment);
                setComment('');
                form.setFieldsValue({ comment: '' });
              }}
              classList="cursor-pointer mb-[5px]"
            >
              Eslatma
            </Text>
            <Form.Item name="comment">
              <Input.TextArea
                onChange={(e) => setComment(e.target.value)}
                placeholder="Kommentariya"
                autoSize={{ minRows: 3, maxRows: 3 }}
                style={{ resize: 'none' }}
              />
            </Form.Item>
          </div>
        )}

        <Form.Item label="Rasm biriktirish">
          <UploadImg imgNames={imgNames} setImgNames={setImgNames} />
        </Form.Item>

        <Form.Item>
          <CustomButton isLoading={loading} type="submit">
            Saqlash
          </CustomButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DebtCreate;