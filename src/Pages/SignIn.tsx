import { GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleOAuthProvider } from "@react-oauth/google";

import { getIdUser } from '../service/apiSignIn'
function SignIn() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
  
          localStorage.setItem('token', token);
          localStorage.setItem('email', decodedToken.email);
          localStorage.setItem('role', decodedToken.role); // Nếu có role
          localStorage.setItem('userId', decodedToken.sub || decodedToken.user_id); // Lưu userId
          localStorage.setItem('isLoggedIn', 'true');
  
          await fetchUserId(token);
          message.success('Đăng nhập Google thành công!');
          navigate('/');
  
          // Clear token from URL after successful login
          const cleanURL = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanURL);
  
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
  
  // Hàm fetchUserId để lấy ID người dùng
  const fetchUserId = async (token: string) => {
    try {
      const data = await getIdUser(token);
      localStorage.setItem('userId', data.userId);
    } catch (error) {
      console.error("Failed to get user ID", error);
    }
  };


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
      
      
          localStorage.setItem('role', 'user');
        
        localStorage.setItem('isLoggedIn', 'true');
        await fetchUserId(response.data.token);
        window.dispatchEvent(new Event('storage'));
        message.success('Login successful!!');

        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login Failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className='hidden md:block bg-black/30 p-8 rounded-xl backdrop-blur-sm w-1/3 shadow-2xl border border-gray-800'>
        <div className='text-center mb-8'>
          <h1 className='text-gray-300 text-lg'>
            The Ultimate Cinema Experience – Welcome to{' '}
            <p className='text-4xl font-bold text-red-500 mb-4 font-sans'>
              CineBooking
            </p>
          </h1>
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