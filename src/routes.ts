const baseUrl = "http://64.225.75.16:5001/api/v1";
// const baseUrl = import.meta.env.BASE_URL;

export default {
  login: () => [baseUrl, 'auth/'].join('/'),
  position: () => [baseUrl, 'companies/profile/'].join('/'),
  drugs: () => [baseUrl, 'drugs/'].join('/'),
  offer: () => [baseUrl, 'offers/'].join('/'),
  offerDrugStores: () => [baseUrl, 'offer-drug-stores/'].join('/'),
  singleOfferDrugStores: (id: number) => [baseUrl, 'offers', `${id}`, 'offer-drug-stores/'].join('/'),
  singleOfferDrugs: (id: number) => [baseUrl, 'offers', `${id}`, 'offer-drugs/'].join('/'),
  companyDrugs: () => [baseUrl, 'company-drugs/'].join('/'),
  singleOfferDrugStore: (offerId: number, drugstoreId: number) => [baseUrl, 'offers', offerId, 'offer-drug-stores', `${drugstoreId}/`].join('/'),
  singleOfferDrug: (offerId: number, drugId: number) => [baseUrl, 'offers', offerId, 'offer-drugs', `${drugId}/`].join('/'),
  singlePositionDrug: (drugId: number) => [baseUrl, 'company-drugs', `${drugId}/`].join('/'),
  competitorDrugs: () => [baseUrl, 'competitor-drugs/'].join('/'),
  editCompetitorDrugs: (drugId: number) => [baseUrl, 'competitor-drugs', `${drugId}/`].join('/'),
  drugStores: () => [baseUrl, 'drugstores/'].join('/'),
  drugReceipt: (offerId: number) => [baseUrl, 'offers', offerId, 'drugs-receipts-avg/'].join('/'),
  


  // class: () => [baseUrl, 'drug-store-classifications/'].join('/'),
  rate: () => [baseUrl, 'drug-store-rates/'].join('/'),
  refresh: () => [baseUrl, 'auth/refresh/'].join('/'),
  // singleClass: (id: number) => [baseUrl, 'drug-store-classifications', `${id}/`].join('/'),
  // singleRate: (id: number) => [baseUrl, 'drug-store-rates', `${id}/`].join('/'),
  
  // offerDrug: () => [baseUrl, 'offer-drugs/'].join('/'),
  // offerDrugTotal: () => [baseUrl, 'offer-drugs', 'total/'].join('/'),
  // // singleOfferDrug: (id: number) => [baseUrl, 'offer-drugs', `${id}/`].join('/'),


  // singleOffer: (id: number) => [baseUrl, 'offers', `${id}/`].join('/'),


  logout: () => [baseUrl, 'logout/'].join('/'),

  me: () => [baseUrl, 'users/me/'].join('/'),
  // register: () => [baseUrl, 'user/register/'].join('/'),
  // atx: () => [baseUrl, 'atx/'].join('/'),
  // roles: () => [baseUrl, 'user/roles/'].join('/'),
  // singleAtx: (id: number) => [baseUrl, 'atx', id, ''].join('/'),
  // atxform: () => [baseUrl, 'atx-form/'].join('/'),
  // singleAtxForm: (id: number) => [baseUrl, 'atx-form', id, ''].join('/'),
  // brand: () => [baseUrl, 'brand/'].join('/'),
  // singleBrand: (id: number) => [baseUrl, 'brand', `${id}/`].join('/'),
}