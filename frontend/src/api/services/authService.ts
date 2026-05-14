import api from '../axios';
import type { AuthResponse } from '../../types/auth';

export const authService = {
  login: async (values: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', values);
    return response.data;
  },

  register: async (values: any): Promise<AuthResponse> => {
    const payload = {
      ...values,
      termsAgreed: values.agreements.includes('terms'),
      privacyAgreed: values.agreements.includes('privacy'),
      marketingAgreed: values.agreements.includes('marketing'),
    };
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  logout: async () => {
    // 백엔드 로그아웃 API가 있다면 여기서 호출
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  sendVerificationCode: async (email: string): Promise<void> => {
    await api.post('/auth/email/send', { email });
  },

  verifyEmail: async (email: string, code: string): Promise<void> => {
    await api.post('/auth/email/verify', { email, code });
  }
};
