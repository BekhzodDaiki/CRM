import { httpClient } from "../httpClient";
import api from '../routes';
import { showError } from "./handlers";

export const getDrugs = async (params: any) => {
  try {
    const request = await httpClient.get(api.drugs(), {
      params
    });

    return request.data;
  } catch (error) {
    return showError();
  }
};

export const getOffers = async (params: any) => {
  try {
    const request = await httpClient.get(api.offer(), {
      params
    });

    return request.data;
  } catch (error) {
    return showError();
  }
};
