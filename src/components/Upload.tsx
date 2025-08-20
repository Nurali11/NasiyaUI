import React, { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
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

const UploadImg: React.FC<{
  setImgNames: Dispatch<SetStateAction<string[]>>;
  imgNames?: string[];
}> = ({ setImgNames, imgNames }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploadComponents, setUploadComponents] = useState([
    { id: 1, fileList: [] as UploadFile[] },
    { id: 2, fileList: [] as UploadFile[] },
  ]);

  useEffect(() => {
  if (imgNames && imgNames.length > 0) {
    const defaultFiles: UploadFile[] = imgNames.map((name, idx) => ({
      uid: `-${idx + 1}`,
      name,
      status: 'done',
      url: `${API}uploads/${name}`,
    }));

    let initialUploads = defaultFiles.map((file, i) => ({
      id: i + 1,
      fileList: [file],
    }));

    const allFilled = initialUploads.every((comp) => comp.fileList.length > 0);
    if (allFilled && initialUploads.length < 8) {
      initialUploads.push({ id: initialUploads.length + 1, fileList: [] });
    }

    setUploadComponents(initialUploads);
    setImgNames(imgNames);
  }
}, [imgNames, setImgNames]);


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = (id: number, newFileList: UploadFile[]) => {
  setUploadComponents(prev =>
    prev.map(comp => {
      if (comp.id === id) {
        return {
          ...comp,
          fileList: newFileList.map(file => ({
            ...file,
            url: file.url || (file.response?.path ? `${API}${file.response.path}` : undefined)
          }))
        };
      }
      return comp;
    })
  );

  const filenames = newFileList
    .filter(f => f.status === "done")
    .map(f => f.response?.filename || f.name);

    
    if(filenames.length > 0) { // @ts-ignore
      setImgNames([...imgNames, ...filenames]);
    }

    
};


  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      type="button"
    >
      <ImgIcon />
      <div style={{ marginTop: 8 }}>Rasm qo‘shish</div>
    </button>
  );

  return (
    <div className="w-[360px] grid grid-cols-2 gap-[30px]">
      {uploadComponents.map((upload) => (
        <Upload
          key={upload.id}
          name="file"
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
