import { Admin, Resource, defaultTheme } from 'react-admin';
import { dataProvider } from './api/dataProvider';
import { authProvider } from './api/authProvider';
import AppLayout from './components/layout/AppLayout';
import users from './pages/users';

const myTheme = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#1677ff',
            light: '#4096ff',
            dark: '#0958d9',
        },
        secondary: {
            main: '#64748b',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontWeightMedium: 600,
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        ...defaultTheme.components,
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                },
                elevation0: {
                    boxShadow: 'none',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none' as const,
                    fontWeight: 600,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#64748b',
                    letterSpacing: '0.5px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                },
            },
        },
    },
};

const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        layout={AppLayout}
        theme={myTheme}
        requireAuth
    >
        <Resource
            name="users"
            {...users}
            options={{ label: '회원 관리' }}
        />
    </Admin>
);

export default App;
