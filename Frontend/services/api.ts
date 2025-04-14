import axios from 'axios';
import { Platform } from 'react-native';

const LOCAL_IP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
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

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  Password: string;
  ConfirmPassword: string;
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
      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    try {
      const response = await api.post('/auth/ForgotPassword', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  verifyOTP: async (data: VerifyOTPData) => {
    try {
      const response = await api.post('/auth/VerifyOtp', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  resetPassword: async (email: string, data: ResetPasswordData) => {
    try {
      console.log(data, 'Request data for password reset');
      const response = await api.post(`/auth/ResetPassword?email=${email}`, data);
      console.log(response, 'Response from password reset API');
      return response;

    } catch (error: any) {
      // Check if the error has a specific message from the response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Default error message if no specific message is found
      throw new Error('Network error. Please check your connection and try again.');
    }
  }  
};