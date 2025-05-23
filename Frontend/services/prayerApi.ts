import AsyncStorage from '@react-native-async-storage/async-storage';
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
api.interceptors.request.use(async (config: any) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting token:', error);
    return Promise.reject(error);
  }
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
  if (error.response.status === 401) {
    // Token expired or invalid
    AsyncStorage.removeItem('userToken');
    // You might want to redirect to login here
  }
  return Promise.reject(error);
});

export interface PrayerRecord {
  prayerDate: Date;
  fajar: number;
  zuhr: number;
  asar: number;
  maghrib: number;
  esha: number;
}

export interface CreatePrayerRequest extends PrayerRecord {
  // Any additional fields needed for the backend (if any)
}

export interface PrayerResponse {
  prayerType: string;
  date: Date;
  status: string;
}

export interface CalendarDay {
  date: string;
  status: "cross" | "tick" | "";
}

export const prayerApi = {
  // Get prayer record for a specific date
  getPrayerByDate: async (date: Date) => {
    try {
      // Format the date as yyyy-MM-dd for consistent handling
      const formattedDate = date.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      console.log('Formatted Date:', formattedDate); // Debugging log
      // Send the GET request with the formatted date
      const response = await api.get(`/prayer/by-date/${formattedDate}`);

      return response.data;
    } catch (error: any) {
      // Handle 404 - No prayer record found
      if (error.response?.status === 404) {
        return null; // No prayer record found for this date
      }

      // Handle any specific error message returned from the backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      // General error handling for other status codes
      throw new Error(`Error: ${error.response?.status || 'Unknown error'}`);
    }
  },

  // Get prayer status by type
  getPrayerByType: async (prayerType: string, date: Date) => {
    try {
      const response = await api.get(`/prayer/by-type/${prayerType.toLowerCase()}`, {
        params: { date: date.toISOString().split('T')[0] } // Send just the date part
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No prayer record found for this type and date
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error: ${error.response?.status || 'Unknown error'}`);
    }
  },

  addPrayer: async (prayer: PrayerRecord) => {
    try {
      const response = await api.post('/prayer', prayer);
      return response.data;  // Return the response data from the backend
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.error('Error details:', error.response?.data);  // Log the error details for debugging
        throw new Error(error.response.data.message);  // Show the backend message (e.g., "Unauthorized request")
      }
      console.error('Error response:', error.response);  // Log the error response
      throw new Error(error.response?.status);  // In case the status code is available but no message
    }
  },
  
  // Update prayer record
  updatePrayer: async (prayer: PrayerRecord) => {
    try {
      const response = await api.put('/prayer', prayer);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.error('Error details:', error.response?.data);
        throw new Error(error.response.data.message);
      }
      console.error('Error response:', error.response);
      throw new Error(error.response?.status);
    }
  },

  // Get prayer calendar data
  getPrayerCalendar: async (year: number, month: number) => {
    try {
      const response = await api.get<CalendarDay[]>('/prayer/calendar', {
        params: { year, month }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.response?.status || 'Failed to fetch calendar data');
    }
  }
};
