import { message } from "antd";
import { httpClient } from "../../../../httpClient";
import api from "../../../../routes";

export const getCategory = async (params = []) => {
  try {
    const request = await httpClient.get(
      api.classification(),
      params ? { params } : null
    );
    return request.data;
  } catch (error) {
    return error;
  }
};

export const createClassification = async (body: any) => {
  try {
    const request = await httpClient.post(api.classification(),body);
    message.success('Классификация успешно создано');
    return request.status;
  } catch (error) {
    message.error('Классификация не создана')
    return error;
  }
};


export const getSingleClassification = async (id: number) => {
  try {
    const request = await httpClient.get(api.singleClassification(id));
    return request.data;
  } catch (error) {
    return error;
  }
};

export const updateSingleClassification = async (id: number, body: any) => {
  try {
    const request = await httpClient.patch(api.singleClassification(id), body);
    message.success('Классификация успешно изменена');
    console.log('reqess: ', request.status);
    return request.status;
  } catch (error) {
    return error;
  }
};