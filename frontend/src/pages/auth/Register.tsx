import { Form, Input, Button, Typography, Card, Checkbox, App } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { useState } from 'react';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const { message } = App.useApp();

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email || form.getFieldError('email').length > 0) {
        message.warning('유효한 이메일을 먼저 입력해주세요.');
        return;
      }
      setSendingCode(true);
      await authService.sendVerificationCode(email);
      message.success('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
      setEmailSent(true);
    } catch (error: any) {
      message.error(error.response?.data?.message || '인증 코드 발송에 실패했습니다.');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const email = form.getFieldValue('email');
      const code = form.getFieldValue('verificationCode');
      if (!code) {
        message.warning('인증 코드를 입력해주세요.');
        return;
      }
      await authService.verifyEmail(email, code);
      message.success('이메일 인증이 완료되었습니다.');
      setEmailVerified(true);
    } catch (error: any) {
      message.error(error.response?.data?.message || '인증 코드가 올바르지 않습니다.');
    }
  };

  const onFinish = async (values: any) => {
    if (!emailVerified) {
      message.error('이메일 인증을 완료해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (!values.agreements?.includes('terms') || !values.agreements?.includes('privacy')) {
        message.error('필수 약관에 동의해주세요.');
        setLoading(false);
        return;
      }

      const data = await authService.register(values);
      if (data.success) {
        message.success('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Card style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>회원가입</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="이메일" required style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <Form.Item
                name="email"
                noStyle
                rules={[
                  { required: true, message: '이메일을 입력해주세요' },
                  { type: 'email', message: '유효한 이메일이 아닙니다' }
                ]}
              >
                <Input size="large" disabled={emailVerified} style={{ flex: 1 }} />
              </Form.Item>
              <Button
                size="large"
                onClick={handleSendCode}
                loading={sendingCode}
                disabled={emailVerified}
              >
                {emailSent ? '재발송' : '인증 요청'}
              </Button>
            </div>
          </Form.Item>

          {emailSent && (
            <Form.Item label="인증 코드" required style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <Form.Item
                  name="verificationCode"
                  noStyle
                >
                  <Input size="large" placeholder="6자리 코드 입력" disabled={emailVerified} style={{ flex: 1 }} />
                </Form.Item>
                <Button
                  size="large"
                  onClick={handleVerifyCode}
                  disabled={emailVerified}
                  type={emailVerified ? 'default' : 'primary'}
                >
                  {emailVerified ? '인증됨' : '확인'}
                </Button>
              </div>
            </Form.Item>
          )}

          <Form.Item
            name="password"
            label="비밀번호"
            extra="8자 이상의 영문, 숫자, 특수문자를 포함해야 합니다."
            rules={[
              { required: true, message: '비밀번호를 입력해주세요' },
              { min: 8, message: '최소 8자 이상이어야 합니다.' },
              {
                pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!_]).*$/,
                message: '영문, 숫자, 특수문자를 포함해야 합니다.'
              }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item name="passwordConfirm" label="비밀번호 확인" dependencies={['password']} rules={[
            { required: true, message: '비밀번호를 다시 입력해주세요' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
              },
            }),
          ]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력해주세요' }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="phone" label="휴대폰 번호">
            <Input size="large" placeholder="01012345678" />
          </Form.Item>

          <Form.Item name="agreements" rules={[{ required: true, message: '약관 동의를 확인해주세요' }]}>
            <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Checkbox value="terms">(필수) 서비스 이용약관 동의</Checkbox>
              <Checkbox value="privacy">(필수) 개인정보 처리방침 동의</Checkbox>
              <Checkbox value="marketing">(선택) 마케팅 수신 동의</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading} disabled={!emailVerified}>
              가입하기
            </Button>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
