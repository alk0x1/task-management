import { api } from '../lib/axios';
import { User } from '../types/index';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  }
};