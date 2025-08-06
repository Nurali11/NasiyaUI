import React, { useState } from 'react';
import { Form, Input, Button, Flex } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import { LoginSchema } from '../validation/Login';
import { Login } from '../service/Login';
import { useCookies } from 'react-cookie';
import imgloading from "../assets/images/loading.png"

const LoginForm: React.FC = () => {
    const [_, setCookies] = useCookies(["token"])
    const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
        const data = {
            username: values.username,
            password: values.password
        }
        setLoading(true)
        Login(data, setCookies, setLoading)
    },
  });

  const isDisabled =
!!formik.errors.username ||
!!formik.errors.password ||
!formik.values.username.trim() ||
!formik.values.password.trim();

  return (
    <Form style={{ maxWidth: 360 }} onFinish={formik.handleSubmit}>
      <Form.Item
        validateStatus={formik.touched.username && formik.errors.username ? 'error' : ''}
        help={formik.touched.username && formik.errors.username}
      >
        <Input
          className="!text-[16px] !py-[5px]"
          name="username"
          placeholder="Login"
          prefix={<UserOutlined />}
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item
        validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
        help={formik.touched.password && formik.errors.password}
      >
        <Input.Password
          className="!text-[16px] !py-[5px]"
          name="password"
          placeholder="Parol"
          prefix={<LockOutlined />}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item>
        <Flex justify="space-between" align="center">
          <div></div>
          <a
            className="border-b-[1px] border-b-[#3478F7] font-semibold"
            href="#"
          >
            Parolni unutdingizmi?
          </a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button
          className={`!text-[18px] !h-[50px] !rounded-[10px] !py-[13px] ${
        isDisabled ? '!bg-[#DDE9FE] !border-none !text-white' : ''
          }`}
          type="primary"
          htmlType="submit"
          block
          disabled={isDisabled}
        >
          {loading ? <img src={imgloading} width={30} height={30}/> : "Kirish"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
