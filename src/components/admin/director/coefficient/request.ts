import { message } from "antd";
import { httpClient } from "../../../../httpClient";
import api from "../../../../routes";
import { showError } from "../../../../shared/handlers";

export const getCoefficientList = async (params = []) => {
  try {
    const request = await httpClient.get(
      api.coefficients(),
      Object.keys(params).length ? { params } : null
    );
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const createCoefficient = async (body: any) => {
  try {
    const request = await httpClient.post(api.coefficients(), body);
    message.success('Коэффициент успешно создан');
    return request.status;
  } catch (error) {
    message.error('Коэффициент не создан / Reason might be sum of monthly coefficients must be equal to 12')
    return showError();
  }
};


export const getSingleCoefficient = async (id: number) => {
  try {
    const request = await httpClient.get(api.singleCoefficient(id));
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const updateSingleCoefficient = async (id: number, body: any) => {
  try {
    const request = await httpClient.patch(api.singleCoefficient(id), body);
    message.success('Коэффициент успешно изменен');
    console.log('reqess: ', request.status);
    return request.status;
  } catch (error) {
    message.error('Коэффициент не создан / Reason might be sum of monthly coefficients must be equal to 12')
    return showError();
  }
};