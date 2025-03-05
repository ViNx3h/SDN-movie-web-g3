import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';

function SignUp() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password
      });

      if (response.data) {
        localStorage.setItem('registeredEmail', values.email);
        navigate('/signin');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      alert(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Logo và Banner bên trái */}
      <div className='hidden md:block bg-black/30 p-8 rounded-xl backdrop-blur-sm w-1/3 shadow-2xl border border-gray-800'>
        <div className='text-center mb-8'>
          <p className='text-gray-300 text-lg'>
            The Ultimate Cinema Experience – Welcome to{' '}
            <h1 className='text-4xl font-bold text-red-500 mb-4 font-sans'>
              CineBooking
            </h1>
          </p>
        </div>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src="/path-to-your-cinema-image.jpg"
            alt="Cinema"
            className="w-full h-auto rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </div>

      {/* Form đăng ký bên phải */}
      <div className="w-full md:w-96 mx-4 md:mx-0">
        <div className="bg-black/30 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Sign Up
          </h2>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            className="space-y-6"
            autoComplete="off" 
          >
            <Form.Item
              name="Username"
              rules={[{ required: true, message: 'Enter your name!' }]}
              
            >

              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Your name"
                className="h-12 !bg-gray-800/50 !border-gray-700 !text-white rounded-lg"
                autoComplete="new-email"
              />
            </Form.Item>

            <Form.Item
              name="Email"
              rules={[
                { required: true, message: 'Enter you email!' },
                { type: 'email', message: 'Invalid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                className="h-12 !bg-gray-800/50 !border-gray-700 !text-white rounded-lg"
                autoComplete='off'
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="h-12 !bg-gray-800/50 !border-gray-700 !text-white rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="h-12 !bg-red-600 hover:!bg-red-700 border-none rounded-lg text-lg font-semibold transition-colors"
              >
                Sign up
              </Button>
            </Form.Item>

            <div className="text-center text-gray-300 space-x-1">
              <span>Already have an account?</span>
              <a
                onClick={() => navigate('/signin')}
                className="text-red-500 hover:text-red-400 cursor-pointer font-medium transition-colors"
              >
                Log in
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;