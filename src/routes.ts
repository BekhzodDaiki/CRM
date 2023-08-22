const baseUrl = "http://64.225.75.16:5001/api/v1";

export default {
  login: () => [baseUrl, "auth/"].join("/"),
  position: () => [baseUrl, "companies/profile/"].join("/"),
  drugs: () => [baseUrl, "drugs/"].join("/"),
  offer: () => [baseUrl, "offers/"].join("/"),
  offerDrugStores: () => [baseUrl, "offer-drug-stores/"].join("/"),
  singleOfferDrugStores: (id: number) =>
    [baseUrl, "offers", `${id}`, "offer-drug-stores/"].join("/"),
  singleOfferDrugs: (id: number) =>
    [baseUrl, "offers", `${id}`, "offer-drugs/"].join("/"),
  companyDrugs: () => [baseUrl, "company-drugs/"].join("/"),
  singleOfferDrugStore: (offerId: number, drugstoreId: number) =>
    [baseUrl, "offers", offerId, "offer-drug-stores", `${drugstoreId}/`].join(
      "/"
    ),
  singleOfferDrug: (offerId: number, drugId: number) =>
    [baseUrl, "offers", offerId, "offer-drugs", `${drugId}/`].join("/"),
  singlePositionDrug: (drugId: number) =>
    [baseUrl, "company-drugs", `${drugId}/`].join("/"),
  competitorDrugs: () => [baseUrl, "competitor-drugs/"].join("/"),
  editCompetitorDrugs: (drugId: number) =>
    [baseUrl, "competitor-drugs", `${drugId}/`].join("/"),
  drugStores: () => [baseUrl, "drugstores/"].join("/"),
  drugReceipt: (offerId: number) =>
    [baseUrl, "offers", offerId, "drugs-receipts-avg/"].join("/"),
  singleDirectorDrugstores: (id: number) =>
    [baseUrl, "drug-store-group-owners", id, "drug-stores/"].join("/"),

  // Admin
  companies: () => [baseUrl, "companies/"].join("/"),
  singleCompanyOffer: (id: number) =>
    [baseUrl, "companies", id, "offers/"].join("/"),
  singleCompany: (id: number) => [baseUrl, "companies", `${id}/`].join("/"),
  pharmacy: () => [baseUrl, "drug-store-users/"].join("/"),
  singlePharmacy: (id: number) =>
    [baseUrl, "drug-store-users", `${id}/`].join("/"),
  groupOwner: () => [baseUrl, "drug-store-group-owners/"].join("/"),
  singleGroupOwner: () => [baseUrl, "drug-store-group-owners/"].join("/"),
  singleDirector: (id: number) =>
    [baseUrl, "drug-store-group-owners", `${id}/`].join("/"),
  drugStoreGroups: () => [baseUrl, "drug-store-groups/"].join("/"),
  classification: () => [baseUrl, 'drug-store-classifications/'].join('/'),
  singleClassification: (id: number) => [baseUrl, 'drug-store-classifications', `${id}/`].join('/'),
  rate: () => [baseUrl, "drug-store-rates/"].join("/"),
  singleRate: (id: number) => [baseUrl, "drug-store-rates", `${id}/`].join("/"),
  refresh: () => [baseUrl, "auth/refresh/"].join("/"),
  adminPriceNDesire: (offerId: number, drugId: number) =>
    [baseUrl, "offers", `${offerId}`, "offer-drugs", `${drugId}/`].join("/"),
  admin: () => [baseUrl, "drug-store-classifications/"].join("/"),
  coefficients: () => [baseUrl, "drugs-coefficients/"].join("/"),
  singleCoefficient: (id: number) => [baseUrl, "drugs-coefficients", `${id}/`].join("/"),
  // singleClass: (id: number) => [baseUrl, 'drug-store-classifications', `${id}/`].join('/'),
  // singleRate: (id: number) => [baseUrl, 'drug-store-rates', `${id}/`].join('/'),

  // offerDrug: () => [baseUrl, 'offer-drugs/'].join('/'),
  // offerDrugTotal: () => [baseUrl, 'offer-drugs', 'total/'].join('/'),
  // // singleOfferDrug: (id: number) => [baseUrl, 'offer-drugs', `${id}/`].join('/'),

  // singleOffer: (id: number) => [baseUrl, 'offers', `${id}/`].join('/'),

  logout: () => [baseUrl, "logout/"].join("/"),

  me: () => [baseUrl, "profile/"].join("/"),

  // register: () => [baseUrl, 'user/register/'].join('/'),
  // atx: () => [baseUrl, 'atx/'].join('/'),
  // roles: () => [baseUrl, 'user/roles/'].join('/'),
  // singleAtx: (id: number) => [baseUrl, 'atx', id, ''].join('/'),
  // atxform: () => [baseUrl, 'atx-form/'].join('/'),
  // singleAtxForm: (id: number) => [baseUrl, 'atx-form', id, ''].join('/'),
  // brand: () => [baseUrl, 'brand/'].join('/'),
  // singleBrand: (id: number) => [baseUrl, 'brand', `${id}/`].join('/'),
};
