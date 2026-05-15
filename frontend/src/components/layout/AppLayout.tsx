import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMapPage = location.pathname === '/map';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
        <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '40px' }}>
          <Link to="/" style={{ color: '#1890ff' }}>Membership App</Link>
        </div>
        <Menu 
          mode="horizontal" 
          style={{ flex: 1, borderBottom: 'none' }}
          items={[
            { key: 'home', label: <Link to="/">홈</Link> },
            { key: 'map', label: <Link to="/map">지도</Link> },
            ...(isAuthenticated ? [{ key: 'mypage', label: <Link to="/mypage">마이페이지</Link> }] : []),
          ]}
        />
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '16px' }}><b>{user?.name}</b>님 환영합니다!</span>
              <Button onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button type="primary" style={{ marginRight: '8px' }}>로그인</Button></Link>
              <Link to="/register"><Button>회원가입</Button></Link>
            </>
          )}
        </div>
      </Header>
      <Content style={isMapPage ? { 
        flex: 1, 
        padding: 0, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      } : { 
        padding: '50px 50px',
        overflow: 'auto'
      }}>
        <div style={isMapPage ? { 
          flex: 1,
          width: '100%' 
        } : { 
          background: '#fff', 
          padding: 24, 
          minHeight: 380, 
          borderRadius: '8px', 
          maxWidth: '1000px', 
          margin: '0 auto' 
        }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', flexShrink: 0, padding: '16px 50px' }}>
        Membership App ©2026 Created by Developer
      </Footer>
    </Layout>
  );
};

export default AppLayout;
