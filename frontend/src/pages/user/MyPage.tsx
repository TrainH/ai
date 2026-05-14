import { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, App, Card, Descriptions, Divider, Popconfirm } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../api/services/userService';

const { Title } = Typography;

const MyPage = () => {
  const { user, logout, checkAuth } = useAuth();
  const [form] = Form.useForm();
  const [pwForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phone: user.phone || '',
      });
    }
  }, [user, form]);

  const onUpdateInfo = async (values: any) => {
    setLoading(true);
    try {
      await userService.updateMyInfo(values);
      message.success('정보가 성공적으로 수정되었습니다.');
      checkAuth();
    } catch (error: any) {
      message.error(error.response?.data?.message || '정보 수정 실패');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values: any) => {
    setPwLoading(true);
    try {
      await userService.changePassword(values);
      message.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      pwForm.resetFields();
      logout();
    } catch (error: any) {
      message.error(error.response?.data?.message || '비밀번호 변경 실패');
    } finally {
      setPwLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      await userService.withdraw();
      message.success('회원 탈퇴가 완료되었습니다.');
      logout();
    } catch (error) {
      message.error('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  if (!user) return <div>로딩중...</div>;

  return (
    <div>
      <Title level={2}>마이페이지</Title>
      
      <Card title="내 정보" style={{ marginBottom: 24 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="이메일">{user.email}</Descriptions.Item>
          <Descriptions.Item label="권한">{user.role}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="정보 수정" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={onUpdateInfo}>
          <Form.Item name="name" label="이름" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="휴대폰 번호">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>저장</Button>
        </Form>
      </Card>

      <Card title="비밀번호 변경" style={{ marginBottom: 24 }}>
        <Form form={pwForm} layout="vertical" onFinish={onChangePassword}>
          <Form.Item name="currentPassword" label="현재 비밀번호" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="새 비밀번호" rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={pwLoading}>비밀번호 변경</Button>
        </Form>
      </Card>

      <Divider />
      
      <div style={{ textAlign: 'right' }}>
        <Popconfirm title="정말 탈퇴하시겠습니까? 복구할 수 없습니다." onConfirm={handleWithdraw} okText="탈퇴" cancelText="취소">
          <Button danger>회원 탈퇴</Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default MyPage;
