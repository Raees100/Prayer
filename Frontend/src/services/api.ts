import axios from 'axios';
import { Platform } from 'react-native';

const LOCAL_IP = '10.0.2.2';
const PORT = '5209';

const API_URL =
  Platform.OS === 'android'
    ? `http://${LOCAL_IP}:${PORT}/api`
    : `http://${LOCAL_IP}:${PORT}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },
};
