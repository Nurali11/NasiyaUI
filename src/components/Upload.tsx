import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { ImgIcon } from '../assets/icons';
import { API } from '../hooks/getEnv';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImg: React.FC<{ setImgNames: Dispatch<SetStateAction<string[]>> }> = ({ setImgNames }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploadComponents, setUploadComponents] = useState([
    { id: 1, fileList: [] as UploadFile[] },
    { id: 2, fileList: [] as UploadFile[] },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = (id: number, newFileList: UploadFile[]) => {
    setUploadComponents((prev) => {
      const updated = prev.map((comp) =>
        comp.id === id ? { ...comp, fileList: newFileList } : comp
      );

      // Сохраняем все имена файлов в стейт родителя
      const allFileNames = updated
        .flatMap(comp => comp.fileList)
        .map(file => file.response?.filename || file.name)
        .filter(Boolean);

      setImgNames(allFileNames);

      // Добавляем новый upload, если все заполнены
      const allFilled = updated.every((comp) => comp.fileList.length > 0);
      if (allFilled && updated.length < 8) {
        return [
          ...updated,
          { id: updated.length + 1, fileList: [] as UploadFile[] },
        ];
      }

      return updated;
    });
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: "pointer"
      }}
      type="button"
    >
      <ImgIcon />
      <div style={{ marginTop: 8 }}>Rasm qo‘shish</div>
    </button>
  );

  return (
    <div className='w-[360px] grid grid-cols-2 gap-[30px]'>
      {uploadComponents.map((upload) => (
        <Upload
          key={upload.id}
          action={`${API}file`}
          listType="picture-card"
          fileList={upload.fileList}
          onPreview={handlePreview}
          onChange={({ fileList }) => handleChange(upload.id, fileList)}
        >
          {upload.fileList.length >= 1 ? null : uploadButton}
        </Upload>
      ))}
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default UploadImg;
