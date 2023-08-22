import { message } from "antd";
import { httpClient } from "../../../../httpClient";
import api from "../../../../routes";
import { showError } from "../../../../shared/handlers";

export const getGroupOwner = async (params: any) => {
  try {
    const request = await httpClient.get(api.groupOwner(), { params });
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const createPharmacyDirector = async (body: any) => {
  try {
    const request = await httpClient.post(api.groupOwner(), body);
    message.success('Компания успешно создано');
    return request.status;
  } catch (error) {
    message.error('Компания не создана')
    return showError();
  }
};

export const getDrugStoreGroups = async (params: any) => {
  try {
    const request = await httpClient.get(api.drugStoreGroups(), { params });
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const getDirectorDrugstores = async (id: number, params: any) => {
  try {
    const request = await httpClient.get(api.singleDirectorDrugstores(id), { params });
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const getSingleDirector = async (id: number) => {
  try {
    const request = await httpClient.get(api.singleDirector(id));
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const updateSingleDirector = async (id: number, body: any) => {
  try {
    const request = await httpClient.patch(api.singleDirector(id), body);
    message.success('Директор успешно изменен');
    return request.status;
  } catch (error) {
    message.error('Директор не изменен')
    return showError();
  }
};
