import  { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Divider, message } from 'antd';

import { GoogleOAuthProvider } from "@react-oauth/google";


function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  useEffect(() => {
    const handleGoogleAuth = () => {

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));

          localStorage.setItem('token', token);
          localStorage.setItem('email', decodedToken.email);
          //  localStorage.setItem('name', decodedToken.name);

          localStorage.setItem('role', decodedToken.role);
          localStorage.setItem('isLoggedIn', 'true');


          message.success('Đăng nhập Google thành công!');
          navigate('/');

          // Xóa token khỏi URL
          window.history.replaceState({}, document.title, '/');

          window.dispatchEvent(new Event('storage'));
        } catch (error) {
          console.error('Lỗi xử lý đăng nhập Google:', error);
          message.error('Đăng nhập Google thất bại!');
          navigate('/signin');
        }
      }
    };

    handleGoogleAuth();
  }, [navigate]);


  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: values.email,
        password: values.password

      });
      localStorage.setItem('email', values.email);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        if (response.data.username) {
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', 'user');
        }
        localStorage.setItem('isLoggedIn', 'true');

        window.dispatchEvent(new Event('storage'));
        message.success('Login successful!!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login Faild.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </div>

      <div className="w-full md:w-96 mx-4 md:mx-0">
        <div className="bg-black/30 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Sign In
          </h2>

          <GoogleOAuthProvider clientId="1052624509234-t89h8rbj4f5m0kr33gv43i6eh0pto3qm.apps.googleusercontent.com">
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-12 bg-white hover:bg-gray-100 text-black mb-6 rounded-lg text-base font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <GoogleOutlined />
              Continue with Google
            </button>
          </GoogleOAuthProvider>

          <Divider className="!border-gray-600">
            <span className="text-gray-400">or sign in with email</span>
          </Divider>

          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="space-y-6"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
                className="h-12 !bg-gray-800/50 !border-gray-700 !text-white rounded-lg"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="h-12 !bg-gray-800/50 !border-gray-700 !text-white rounded-lg"
                autoComplete="off"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-300">
                  Remember me
                </Checkbox>
              </Form.Item>
              <a className="text-red-500 hover:text-red-400 transition-colors">
                Forgot password?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="h-12 !bg-red-600 hover:!bg-red-700 border-none rounded-lg text-lg font-semibold transition-colors"
              >
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center text-gray-300 space-x-1">
              <span>Don't have an account?</span>
              <a
                onClick={() => navigate('/signup')}
                className="text-red-500 hover:text-red-400 cursor-pointer font-medium transition-colors"
              >
                Sign up now
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;