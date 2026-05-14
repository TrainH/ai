import { Admin, Resource } from 'react-admin';
import { dataProvider } from './api/dataProvider';
import { authProvider } from './api/authProvider';
import AppLayout from './components/layout/AppLayout';
import users from './pages/users';

const App = () => (
    <Admin 
        dataProvider={dataProvider} 
        authProvider={authProvider}
        layout={AppLayout}
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
