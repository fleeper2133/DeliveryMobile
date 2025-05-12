// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор для обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        const response = await axios.post(`token/refresh/`, {
          refresh: refreshToken
        });
        
        await AsyncStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если обновление токена не удалось, перенаправляем на экран входа
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        // Здесь можно добавить навигацию на экран входа
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const loginUser = async (credentials: { username: string; password: string }) => {
  const response = await api.post('token/', credentials);
  return response.data;
};

export const fetchDeliveries = async () => {
  const response = await api.get('/deliveries');
  console.log("response", response);
  return response.data;
};

export const fetchDelivery = async (deliveryId) => {
  const response = await api.get(`/deliveries/${deliveryId}/`);
  return response.data;
};
export const updateDelivery = async (deliveryId, data: any) => {
  const response = await api.patch(`/deliveries/${deliveryId}/`, data);
  return response.data;
};


// api.ts
export const fetchTransports = async () => {
  const response = await api.get('/transport-models/');
  console.log("response", response);
  return response.data;
};

export const fetchPackagingTypes = async () => {
  const response = await api.get('/packaging-types/');
  return response.data;
};

export const fetchStatuses = async () => {
  const response = await api.get('/delivery-statuses/');
  return response.data;
};

export const fetchServices = async () => {
  const response = await api.get('/services/');
  return response.data;
};

export const fetchTypeCargo = async () => {
  const response = await api.get('/cargo-types/');
  return response.data;
}



export const createDelivery = async (data) => {
  try {
    const response = await api.post('/deliveries/', data);
    return response.data;
  } catch (error) {
    console.error('Full error response:', {
      status: error.response?.status,
      data: error.response?.data,  // Здесь будут детали ошибки
      headers: error.response?.headers,
      config: error.response?.config,
    });
    throw error;
  }
};

export const completeDelivery = async (deliveryId) => {
  const response = await api.post(`/deliveries/${deliveryId}/complete/`);
  return response.data;
};

