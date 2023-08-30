const baseUrl = "http://64.225.75.16:5001/api/v1";

export default {
  login: () => [baseUrl, "auth/"].join("/"),
  position: () => [baseUrl, "companies", "profile/"].join("/"),
  drugs: () => [baseUrl, "companies", "drugs/"].join("/"),
  offer: () => [baseUrl, "companies", "offers/"].join("/"),
  offerDrugStores: () => [baseUrl, "offer-drug-stores/"].join("/"),
  singleOfferDrugStores: (id: number) =>
    [baseUrl, "companies", "offers", `${id}`, "offer-drug-stores/"].join("/"),
  singleOfferDrugs: (id: number) =>
    [baseUrl,"companies", "offers", `${id}`, "offer-drugs/"].join("/"),
  companyDrugs: () => [baseUrl, "companies", "company-drugs/"].join("/"),
  singleOfferDrugStore: (offerId: number, drugstoreId: number) =>
    [baseUrl, "offers", offerId, "offer-drug-stores", `${drugstoreId}/`].join(
      "/"
    ),
  singleOfferDrug: (offerId: number, drugId: number) =>
    [baseUrl, "companies", "offers", offerId, "offer-drugs", `${drugId}/`].join("/"),
  singlePositionDrug: (drugId: number) =>
    [baseUrl, "companies", "company-drugs", `${drugId}/`].join("/"),
  competitorDrugs: () => [baseUrl, "companies", "competitor-drugs/"].join("/"),
  editCompetitorDrugs: (drugId: number) =>
    [baseUrl, "companies", "competitor-drugs", `${drugId}/`].join("/"),
  drugStores: () => [baseUrl,"companies", "drugstores/"].join("/"),
  drugReceipt: (offerId: number) =>
    [baseUrl, "offers", offerId, "drugs-receipts-avg/"].join("/"),
  singleDirectorDrugstores: (id: number) =>
    [baseUrl, "drug-store-group-owners", id, "drug-stores/"].join("/"),

  // Admin
  companies: () => [baseUrl, "managers", "companies/"].join("/"),
  managerOffer: () => [baseUrl, "managers", "offers/"].join('/'),
  singleCompanyOffer: (id: number) =>
    [baseUrl, "managers", "companies", id, "offers/"].join("/"),
  singleCompany: (id: number) => [baseUrl, "managers", "companies", `${id}/`].join("/"),
  pharmacy: () => [baseUrl, "managers", "drug-store-users/"].join("/"),
  singlePharmacy: (id: number) =>
    [baseUrl, "managers", "drug-store-users", `${id}/`].join("/"),
  groupOwner: () => [baseUrl, "managers", "drug-store-group-owners/"].join("/"),
  singleGroupOwner: () => [baseUrl, "managers", "drug-store-group-owners/"].join("/"),
  singleDirector: (id: number) =>
    [baseUrl, "managers", "drug-store-group-owners", `${id}/`].join("/"),
  drugStoreGroups: () => [baseUrl, "managers", "drug-store-groups/"].join("/"),
  classification: () => [baseUrl, "managers", 'drug-store-classifications/'].join('/'),
  singleClassification: (id: number) => [baseUrl, "managers", 'drug-store-classifications', `${id}/`].join('/'),
  rate: () => [baseUrl, "managers", "drug-store-rates/"].join("/"),
  singleRate: (id: number) => [baseUrl, "managers", "drug-store-rates", `${id}/`].join("/"),
  refresh: () => [baseUrl, "auth/refresh/"].join("/"),
  adminPriceNDesire: (offerId: number, drugId: number) =>
    [baseUrl, "companies", "offers", `${offerId}`, "offer-drugs", `${drugId}/`].join("/"),
  // adminPriceNDesire: (offerId: number, drugId: number) =>
  //   [baseUrl, "offers", `${offerId}`, "offer-drugs", `${drugId}/`].join("/"),
  admin: () => [baseUrl, "managers", "drug-store-classifications/"].join("/"),
  coefficients: () => [baseUrl, "managers", "drugs-coefficients/"].join("/"),
  singleCoefficient: (id: number) => [baseUrl, "managers", "drugs-coefficients", `${id}/`].join("/"),
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
