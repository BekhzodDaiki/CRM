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
