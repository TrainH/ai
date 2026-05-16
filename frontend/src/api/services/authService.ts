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
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      // 서버에 Refresh Token 폐기 요청 (실패해도 클라이언트는 로그아웃 진행)
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // 서버 오류가 있어도 클라이언트 토큰은 반드시 삭제
      console.warn('서버 로그아웃 요청 실패, 클라이언트 토큰만 삭제합니다.', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  sendVerificationCode: async (email: string): Promise<void> => {
    await api.post('/auth/email/send', { email });
  },

  verifyEmail: async (email: string, code: string): Promise<void> => {
    await api.post('/auth/email/verify', { email, code });
  }
};
