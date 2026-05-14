import { Typography } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Title>엔터프라이즈 멤버십 시스템</Title>
      <Paragraph style={{ fontSize: '18px' }}>
        안전하고 확장 가능한 React + Spring Boot 기반의 회원 관리 시스템입니다.
      </Paragraph>

      {isAuthenticated ? (
        <div style={{ marginTop: '40px', padding: '20px', background: '#f0f2f5', borderRadius: '8px', display: 'inline-block' }}>
          <Title level={3}>환영합니다, {user?.name}님!</Title>
          <Paragraph>상단 메뉴를 통해 마이페이지에 접근하거나 정보를 수정할 수 있습니다.</Paragraph>
        </div>
      ) : (
        <Paragraph style={{ marginTop: '40px', color: '#8c8c8c' }}>
          서비스를 이용하시려면 로그인을 진행해 주세요.
        </Paragraph>
      )}
    </div>
  );
};

export default Home;
