import { message } from "antd";
import { httpClient } from "../../../../httpClient";
import api from "../../../../routes";
import { showError } from "../../../../shared/handlers";

export const getPharmacies = async (params: any) => {
  try {
    const request = await httpClient.get(api.pharmacy(), { params });
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const createCompany = async (body: any) => {
  try {
    const request = await httpClient.post(api.companies(), body);
    message.success('Компания успешно создано');
    return request.status;
  } catch (error) {
    message.error('Компания не создана')
    return showError();
  }
};

export const getDrugStores = async (params: any) => {
  try {
    const request = await httpClient.get(api.drugStores(), { params });
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const createPharmacy = async (body: any) => {
  try {
    const request = await httpClient.post(api.pharmacy(), body);
    return request.status;
  } catch (error) {
    return showError();
  }
}

export const getSinglePharmacy = async (id: number) => {
  try {
    const request = await httpClient.get(api.singlePharmacy(id));
    return request.data;;
  } catch (error) {
    return showError();
  }
};

export const updateSinglePharmacy = async (id: number, body: any) => {
  try {
    const request = await httpClient.patch(api.singlePharmacy(id), body);
    message.success('Аптека успешно изменено');
    console.log('reqess: ', request.status);
    return request.status;
  } catch (error) {
    return showError();
  }
};