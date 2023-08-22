import { message } from "antd";
import { httpClient } from "../../../../httpClient";
import api from "../../../../routes";
import { showError } from "../../../../shared/handlers";

export const getRates = async (params = {}) => {
  try {
    const request = await httpClient.get(
      api.rate(),
      Object.keys(params).length ? { params } : null
    );
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const createRate = async (body: any) => {
  try {
    const request = await httpClient.post(api.rate(),body);
    message.success('Оценка успешно создано');
    return request.status;
  } catch (error) {
    message.error('Оценка не создана')
    return showError();
  }
};


export const getSingleRate = async (id: number) => {
  try {
    const request = await httpClient.get(api.singleRate(id));
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const updateSingleRate = async (id: number, body: any) => {
  try {
    const request = await httpClient.patch(api.singleRate(id), body);
    message.success('Оценка успешно изменена');
    console.log('reqess: ', request.status);
    return request.status;
  } catch (error) {
    return showError();
  }
};