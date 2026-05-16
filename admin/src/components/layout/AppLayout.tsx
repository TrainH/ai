import { Layout, AppBar, TitlePortal } from 'react-admin';
import { Typography, Box, useMediaQuery, Theme } from '@mui/material';

const MyAppBar = (props: any) => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <AppBar
            {...props}
            sx={{
                background: 'rgba(255, 255, 255, 0.85) !important',
                backdropFilter: 'blur(10px)',
                color: '#1e293b',
                boxShadow: 'none !important',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                padding: isMobile ? '0 8px' : '0 16px',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        fontSize: isMobile ? '16px' : '20px',
                        color: '#1677ff',
                        letterSpacing: '-0.5px',
                    }}
                >
                    MEMBERSHIP ADMIN
                </Typography>
            </Box>
            <TitlePortal />
        </AppBar>
    );
};

const AppLayout = (props: any) => (
    <Layout
        {...props}
        appBar={MyAppBar}
        sx={{
            // 전체 배경색
            backgroundColor: '#f8fafc',

            // 콘텐츠 영역 (사이드바 + 메인 전체 감싸는 영역)
            '& .RaLayout-content': {
                backgroundColor: '#f8fafc',
            },

            // 메인 컨텐츠 패딩 (모바일 / 데스크탑 반응형)
            '& .RaLayout-contentWithSidebar': {
                backgroundColor: '#f8fafc',
            },

            // 사이드바 스타일
            '& .MuiDrawer-paper': {
                backgroundColor: '#fff',
                borderRight: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: 'none',
            },

            // 메인 내용 카드 프레임 효과
            '& .RaLayout-content > *': {
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
            },
        }}
    />
);

export default AppLayout;
