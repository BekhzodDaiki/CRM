import { httpClient } from "../../httpClient";
import api from '../../routes';
import { errorHandlers } from "../../shared/handlers";
import { IClassification } from "../../shared/types";

export const getOfferDrugStoreList = async (params: any) => {
  try {
    const request = await httpClient.get(api.offerDrugStores(), {
      params
    });

    return request.data;
  } catch (error) {
    return error;
  }
};

export const getDrugStores = async (params: any) => {
  try {
    const request = await httpClient.get(api.drugStores(), {
      params
    });

    return request.data;
  } catch (error) {
    return error;
  }
};

export const createRate = async (data: any) => {
  try {
    const request = await httpClient.post(api.rate(), data);
    return request;
  } catch (error) {
    return errorHandlers(error);
  }
}

export const getSingleOfferDrugStore = async (Id: number) => {
  try {
    const request = await httpClient.get(api.singleOfferDrugStores(Id));
    return request.data;
  } catch (error) {
    return error;
  }
};

export const updateRate = async (id: number, data: any) => {
  try {
    const request = await httpClient.patch(api.singleRate(id), data);

    return request;
  } catch (error) {
    return errorHandlers(error);
  }
};