import React, { useState } from 'react';
import { Modal } from 'antd';
import Text from './Text';
import { useMutation } from '@tanstack/react-query';
import { instance } from '../hooks/instance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../hooks/path';

const CustomModal: React.FC<{open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, url: string}> = ({open, setOpen, url}) => {
  const [modalText, setModalText] = useState('O‘chirishni tasdiqlaysizmi?');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: () => instance.delete(url),
    onSuccess: () => {
        navigate(PATH.debtor)
        toast.success("Muvaffaqiyatli o‘chirildi");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    }
  });

  const handleDeleteClick = () => {
    setModalText('Ma’lumotlar o‘chirilyapti...');
    setLoading(true)
    setTimeout(() => {
        deleteMutation.mutate();
    },800)
  };

  return (
    <Modal
      title="O‘chirish"
      open={open}
      onOk={handleDeleteClick}
      okType='danger'
      okText='O‘chirish'
      confirmLoading={loading}
      onCancel={() => setOpen(false)}
    >
      <Text classList='!text-[15px]'>{modalText}</Text>
    </Modal>
  );
};

export default CustomModal;
