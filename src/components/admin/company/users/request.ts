import { message } from "antd";
import { httpClient } from "../../../../httpClient";
import api from "../../../../routes";

export const getCompanies = async (params: any) => {
  try {
    const request = await httpClient.get(api.companies(), { params });
    return request.data;
  } catch (error) {
    return error;
  }
};

export const createCompany = async (body: any) => {
  try {
    const request = await httpClient.post(api.companies(),body);
    message.success('Компания успешно создано');
    return request.status;;
  } catch (error) {
    message.error('Компания не создана')
    return error;
  }
};

export const getSingleCompanyOffers = async (id: number, params: any) => {
  try {
    const request = await httpClient.get(api.singleCompanyOffer(id), {params});
    return request.data;;
  } catch (error) {
    return error;
  }
};

export const getSingleCompany = async (id: number) => {
  try {
    const request = await httpClient.get(api.singleCompany(id));
    return request.data;;
  } catch (error) {
    return error;
  }
};

export const updateSingleCompany = async (id: number, body: any) => {
  try {
    const request = await httpClient.patch(api.singleCompany(id), body);
    message.success('Компания успешно изменено');
    console.log('reqess: ', request.status);
    return request.status;
  } catch (error) {
    return error;
  }
};
