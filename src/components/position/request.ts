import { httpClient } from "../../httpClient";
import api from "../../routes";
import { errorHandlers, showError } from "../../shared/handlers";
import { IClassification } from "../../shared/types";

export const getCompanyDrugs = async () => {
  try {
    const request = await httpClient.get(api.companyDrugs());

    return request.data;
  } catch (error) {
    return showError();
  }
};

export const getDrugs = async (params: any) => {
  try {
    const request = await httpClient.get(api.drugs(), {
      params,
    });

    return request.data;
  } catch (error) {
    return showError();
  }
};

export const bindDrugsToUser = async (drugs: number[]) => {
  try {
    const request = await httpClient.post(api.companyDrugs(), {
      drugs,
    });

    return request.data;
  } catch (error) {
    return showError();
  }
};

export const removePositionDrug = async (drugId: number) => {
  try {
    const request = await httpClient.delete(api.singlePositionDrug(drugId));

    return request;
  } catch (error) {
    return showError();
  }
};

export const getCompetitors = async (params: any) => {
  try {
    const request = await httpClient.get(api.competitorDrugs());
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const editCompetitorDrugs = async (drugId: number, body: any) => {
  try {
    const request = await httpClient.patch(
      api.editCompetitorDrugs(drugId),
      body
    );
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const deleteCompetitorDrugs = async (drugId: number) => {
  try {
    const request = await httpClient.delete(api.editCompetitorDrugs(drugId));
    return request.data;
  } catch (error) {
    return showError();
  }
};

export const createCompetitorDrug = async (body: any) => {
  try {
    const request = await httpClient.post(api.competitorDrugs(), body);
    return request.data;
  } catch (error) {
    return showError();
  }
};
