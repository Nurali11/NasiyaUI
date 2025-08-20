import React, { useState } from 'react';
import { Modal } from 'antd';
import Text from './Text';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../hooks/instance';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const CustomModal: React.FC<{open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, url: string, queryKey?: string, title?: string}> = ({open, setOpen, url, queryKey, title}) => {
  const [modalText, setModalText] = useState(title || 'O‘chirishni tasdiqlaysizmi?');
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['token'])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const deleteMutation = useMutation({
    mutationFn: () => instance.delete(url, { headers: { Authorization: `Bearer ${cookies.token}` } }),
    onSuccess: () => {
        queryClient.invalidateQueries()
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
        navigate(-1)
    },800)
  };

  return (
    <Modal
      title="O‘chirish"
      open={open}
      onOk={handleDeleteClick}
      okType='danger'
      cancelText='Bekor qilish'
      okText='O‘chirish'
      confirmLoading={loading}
      onCancel={() => setOpen(false)}
    >
      <Text classList='!text-[15px]'>{modalText}</Text>
    </Modal>
  );
};

export default CustomModal;
