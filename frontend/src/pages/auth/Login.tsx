import { Form, Input, Button, Typography, Card, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../api/services/authService';
import { useState } from 'react';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const data = await authService.login(values);
      if (data.success) {
        message.success('로그인 되었습니다.');
        login(data.accessToken, data.refreshToken, data.user);
        navigate('/');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>로그인</Title>
        <Form name="normal_login" onFinish={onFinish} layout="vertical">
          <Form.Item name="email" rules={[{ required: true, message: '이메일을 입력해주세요!' }, { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }]}>
            <Input prefix={<UserOutlined />} placeholder="이메일" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              로그인
            </Button>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              계정이 없으신가요? <Link to="/register">회원가입</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
