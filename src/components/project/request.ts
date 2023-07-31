import { httpClient } from "../../httpClient";
import api from '../../routes';
import { errorHandlers } from "../../shared/handlers";
import { IClassification } from "../../shared/types";

export const getOffers = async (params?: any) => {
  try {
    const request = await httpClient.get(api.offer(), {params});

    return request.data;
  } catch (error) {
    return error;
  }
};

export const getSingleOfferDrugStores = async (Id: number, params: any) => {
  try {
    const request = await httpClient.get(api.singleOfferDrugStores(Id), {params});
    return request.data;
  } catch (error) {
    return error;
  }
};

export const addOfferDrugStoresToOffer = async (Id: number, body: any) => {
  try {
    const request = await httpClient.post(api.singleOfferDrugStores(Id), body);
    return request.data;
  } catch (error) {
    return error;
  }
};

export const removeOfferDrugStoresFromOffer = async (offerId: number, drugstoreId: number) => {
  try {
    const request = await httpClient.delete(api.singleOfferDrugStore(offerId, drugstoreId));
    return request.data;
  } catch (error) {
    return error;
  }
};

export const getSingleOfferDrugs = async (params: any) => {
  try {
    const request = await httpClient.get(api.companyDrugs(), {params});
    return request.data;
  } catch (error) {
    return error;
  }
};

export const getSearchedDrugs = async (params: any) => {
  try {
    const request = await httpClient.get(api.companyDrugs(), {
      params
    });
    return request.data;
  } catch (error) {
    return error;
  }
}

export const addOfferDrug = async (Id: number, body: any) => {
  try {
    const request = await httpClient.post(api.singleOfferDrugs(Id), body);
    return request.data;
  } catch (error) {
    return error;
  }
};

export const removeOfferDrug = async (id: number, drugId: any) => {
  try {
    const request = await httpClient.delete(api.singleOfferDrug(id, drugId));
    return request.data;
  } catch (error) {
    return error;
  }
};

export const removeCompanyDrug = async (drugId: number) => {
  try {
    const request = await httpClient.delete(api.singlePositionDrug(drugId));
    return request.data;
  } catch (error) {
    return error;
  }
};

export const searchDrugstore = async (params: any) => {
  try {
    const request = await httpClient.get(api.drugStores(), {
      params,
    });
    return request.data;
  } catch (error) {
    return error;
  }
};


export const getPlanList = async (offerId: number, params: any) => {
  try {
    const request = await httpClient.get(api.singleOfferDrugs(offerId), {
      params,
    });
    return request.data;
  } catch (error) {
    return error;
  }
};

export const getDrugRecepits = async (offerId: number, params: any) => {
  try {
    const request = await httpClient.get(api.drugReceipt(offerId), {
      params,
    });
    return request.data;
  } catch (error) {
    return error;
  }
};


export const updateSingleOffer = async (offerId: number, offerDrugId: number, params: any) => {
  try {
    const request = await httpClient.get(api.singleOfferDrug(offerId, offerDrugId), {
      params,
    });
    return request.data;
  } catch (error) {
    return error;
  }
};





// export const getDrugs = async (params: any) => {
//   try {
//     const request = await httpClient.get(api.offer(), {
//       params
//     });

//     return request.data;
//   } catch (error) {
//     return error;
//   }
// };


export const bindDrugsToUser = async (params: any) => {
  try {
    const request = await httpClient.patch(api.position(), params);

    return request.data;
  } catch (error) {
    return error;
  }
};


// export const createClass = async (data: IClassification) => {
//   try {
//     const request = await httpClient.post(api.class(), data);
//     return request;
//   } catch (error) {
//     return errorHandlers(error);
//   }
// }



// export const updateClass = async (id: number, data: IClassification) => {
//   try {
//     const request = await httpClient.patch(api.singleClass(id), data);

//     return request;
//   } catch (error) {
//     return errorHandlers(error);
//   }
// };