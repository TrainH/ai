import { Layout, Menu, Button, Grid, Drawer, Space } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { authService } from '../../api/services/authService';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMapPage = location.pathname === '/map';
  const isMobile = !screens.md;

  const handleLogout = async () => {
    await authService.logout(); // 서버에 Refresh Token 폐기 요청
    logout();                   // Context 상태 초기화
    navigate('/login');
    setIsDrawerOpen(false);
  };

  const menuItems = [
    { key: 'home', label: <Link to="/" onClick={() => setIsDrawerOpen(false)}>홈</Link> },
    { key: 'map', label: <Link to="/map" onClick={() => setIsDrawerOpen(false)}>지도</Link> },
    ...(isAuthenticated ? [{ key: 'mypage', label: <Link to="/mypage" onClick={() => setIsDrawerOpen(false)}>마이페이지</Link> }] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--app-bg)' }}>
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: isMobile ? '0 16px' : '0 40px',
        height: '64px'
      }}>
        <div className="logo" style={{ fontSize: '20px', fontWeight: 800, marginRight: isMobile ? 'auto' : '40px' }}>
          <Link to="/" style={{ color: 'var(--app-primary)', letterSpacing: '-0.5px' }}>
            MEMBERSHIP
          </Link>
        </div>

        {!isMobile && (
          <Menu 
            mode="horizontal" 
            selectedKeys={[location.pathname.split('/')[1] || 'home']}
            style={{ flex: 1, borderBottom: 'none', background: 'transparent' }}
            items={menuItems}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isMobile ? (
            isAuthenticated ? (
              <Space size="middle">
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  <UserOutlined style={{ marginRight: '4px' }} />
                  <b>{user?.name}</b>님
                </span>
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  style={{ color: '#ef4444' }}
                >
                  로그아웃
                </Button>
              </Space>
            ) : (
              <Space>
                <Link to="/login"><Button type="text">로그인</Button></Link>
                <Link to="/register"><Button type="primary" shape="round">시작하기</Button></Link>
              </Space>
            )
          ) : (
            <Button 
              type="text" 
              icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
              onClick={() => setIsDrawerOpen(true)} 
            />
          )}
        </div>
      </Header>

      <Content style={isMapPage ? { 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      } : { 
        padding: isMobile ? '16px' : '40px 20px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={isMapPage ? { 
          flex: 1,
          width: '100%' 
        } : { 
          background: '#fff', 
          padding: isMobile ? '24px 16px' : '40px', 
          minHeight: 'calc(100vh - 200px)', 
          borderRadius: isMobile ? '16px' : '24px', 
          maxWidth: '1000px', 
          width: '100%',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.03)'
        }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
        Membership App ©2026 Created with Premium Design
      </Footer>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={280}
      >
        <Menu 
          mode="vertical" 
          selectedKeys={[location.pathname.split('/')[1] || 'home']}
          style={{ borderRight: 'none' }}
          items={menuItems}
        />
        <div style={{ marginTop: '24px', padding: '0 16px' }}>
          {isAuthenticated ? (
            <Button block danger onClick={handleLogout} icon={<LogoutOutlined />}>
              로그아웃
            </Button>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Link to="/login" style={{ width: '100%' }}>
                <Button block onClick={() => setIsDrawerOpen(false)}>로그인</Button>
              </Link>
              <Link to="/register" style={{ width: '100%' }}>
                <Button block type="primary" onClick={() => setIsDrawerOpen(false)}>회원가입</Button>
              </Link>
            </Space>
          )}
        </div>
      </Drawer>
    </Layout>
  );
};

export default AppLayout;
