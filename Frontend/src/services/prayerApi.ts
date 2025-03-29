import axios, { AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

const LOCAL_IP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const PORT = '5209';

const API_URL = `http://${LOCAL_IP}:${PORT}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to prevent long-hanging requests
});

// Add token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, (error: AxiosError) => {
  if (!error.response) {
    // Network error
    return Promise.reject(new Error('Network error. Please check your connection and try again.'));
  }
  return Promise.reject(error);
});

export interface PrayerRecord {
  prayerDate: Date;
  fajar: string;
  zuhr: string;
  asar: string;
  maghrib: string;
  esha: string;
}

export interface PrayerResponse {
  prayerType: string;
  date: Date;
  status: string;
}

export const prayerApi = {
  // Get prayer record for a specific date
  getPrayerByDate: async (date: Date) => {
    try {
      const response = await api.get(`/prayer/by-date/${date.toISOString()}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No prayer record found for this date
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  // Get prayer status by type
  getPrayerByType: async (prayerType: string, date: Date) => {
    try {
      const response = await api.get(`/prayer/by-type/${prayerType.toLowerCase()}`, {
        params: { date: date.toISOString() }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No prayer record found for this type and date
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  // Add new prayer record
  addPrayer: async (prayer: PrayerRecord) => {
    try {
      const response = await api.post('/prayer', prayer);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  // Update prayer record
  updatePrayer: async (prayer: PrayerRecord) => {
    try {
      const response = await api.put('/prayer', prayer);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  // Get prayer calendar data
  getPrayerCalendar: async (year: number, month: number) => {
    try {
      const response = await api.get('/prayer/calendar', {
        params: { year, month }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }
};