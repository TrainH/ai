import type { AuthProvider } from 'react-admin';
import axios from 'axios';

const apiUrl = 'http://localhost:8080/api';

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        const response = await axios.post(`${apiUrl}/auth/login`, {
            email: username,
            password,
        });
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        const { accessToken, user } = response.data;
        
        // 권한 확인
        if (user.role !== 'ROLE_ADMIN') {
            throw new Error('관리자 권한이 없습니다.');
        }

        localStorage.setItem('adminToken', accessToken);
        localStorage.setItem('adminUser', JSON.stringify(user));
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('adminToken') ? Promise.resolve() : Promise.reject();
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        const userStr = localStorage.getItem('adminUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            return Promise.resolve(user.role);
        }
        return Promise.resolve('');
    },
};
