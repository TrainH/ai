import api from '../axios';
import type { User } from '../../types/auth';

export const userService = {
  getMyInfo: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateMyInfo: async (values: any): Promise<void> => {
    await api.patch('/users/me', values);
  },

  changePassword: async (values: any): Promise<void> => {
    await api.patch('/users/me/password', values);
  },

  withdraw: async (): Promise<void> => {
    await api.delete('/users/me');
  }
};
