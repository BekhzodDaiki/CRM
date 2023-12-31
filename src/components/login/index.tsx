import {
  Form,
  Input,
} from 'antd';
import { Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { Card, CenterPos } from '../../assets/reusable/styles';
import { login, me } from './request';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../reducer/user';
import { useAppDispatch } from '../../hooks';

const App = () => {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    const result = await login(values);
    setLoading(false);
    if (result?.detail) {
      notification.warning({
        message: "Couldn't login",
        description:
          result.detail,
        onClick: () => {
          console.log('Notification Clicked!');
        },
        duration: 3
      });
      return;
    }
    // dispatch(getUser({name: 'test', id: '5', email: 'test'}));
    
    
    localStorage.setItem('access', result.access);
    localStorage.setItem('refresh', result.refresh);
    // console.log('tempMe: ', tempMe);
    
    const tempMe = await me();
    dispatch(getUser(tempMe));
    localStorage.setItem('user', tempMe.user.is_manager ? 'admin' : 'company');
    if (tempMe.user.is_manager) {
      return navigate('/company/user?page=1&size=20');
    } else {
      navigate('/position?page=1&size=20');
    }
  };

  useEffect(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <CenterPos>
      <Card>
        <h2>Mena Admin :)</h2>
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </CenterPos>
  );
};

export default App;