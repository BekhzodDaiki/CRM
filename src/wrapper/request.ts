import { httpClient } from "../httpClient";
import api from '../routes';

export const logout = async () => {
  try {
    await httpClient.post(api.logout(), {
      refresh: localStorage.getItem('refresh')
    });
    localStorage.removeItem('refresh');
    localStorage.removeItem('access');
  } catch (error) {
    return error;
  }
};
