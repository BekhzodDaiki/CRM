import axios from 'axios';
import api from './routes';

const tokenRefresh = async () => {
  try {
    const result = await httpClient.post(
      api.refresh(), { refresh: localStorage.getItem('refresh') }
    );
    localStorage.removeItem('access');
    localStorage.setItem('access', result.data.access);
    return result.data.access;
  } catch (error) {
    console.log('error: ', error);
  }
}

export const httpClient = axios.create();

httpClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access');
    if (token) {
      // @ts-ignore
      config.headers = {
        Authorization: `Bearer ${token}`,
      }
    }

      return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
httpClient.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const access_token = await tokenRefresh();            
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    return httpClient(originalRequest);
  }
  return Promise.reject(error);
});

