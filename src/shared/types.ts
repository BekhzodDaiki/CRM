export interface ATXI {
  code: string;
  id: string;
  name_en: string;
  name_local: string;
  name_ru: string;
  parent: number | null;
}

export interface ATXForm {
  id: number;
  atx_id: number;
  name: string;
}

export interface CountryType {
  id: number | undefined;
  name_en: string;
  name_local: string;
  name_ru: string;
  short_name: string;
}

export interface CityType {
  country: number | null;
  id: number;
  name_en: string | null;
  name_local: string | null;
  name_ru: string | null;
}

export interface RegionType {
  city: number | null;
  id: number;
  name_en: string | null;
  name_local: string | null;
  name_ru: string | null;
}

export interface BarcodeType {
  id: number;
  code: string;
}

export interface FormClassification {
  id: number;
  code: string;
  name_en: string | null;
  name_local: string | null;
  name_ru: string | null;
}

export interface Mnn {
  id: number;
  name_en: string | null;
  name_local: string | null;
  name_ru: string | null;
}

export interface RegCertification {
  country: number;
  id: number;
  name_en: string | null;
  name_local: string | null;
  name_ru: string | null;
}

export interface PharmacyType {
  abc_analytics: string | "C";
  address: string | null;
  description: string | null;
  has_delivery: boolean;
  id: number;
  is_hide_price: boolean;
  is_active: boolean;
  is_open_24h: boolean;
  latitude: number | null;
  logo: string | null;
  longitude: number | null;
  name_en: string;
  name_local: string | null;
  name_ru: string | null;
  organization: number | null;
  phone_1: string;
  phone_2: string | null;
  photo: string | null;
  reference_point: string | null;
  region: number | null;
  status: number | null;
  work_time: string | null;
  zip: string | null;
}

export interface Product {
  atx: string;
  atx_form: string;
  id: number;
  is_deleted: boolean;
  mnn: string;
  name_en: string | null;
  reg_cert_holder: {
    name_en: string;
    country: string;
  };
  vendor: {
    name_en: string;
    country: string;
  };
}

export interface Offer {
  id: number;
  is_deleted: boolean;
  original_product_name: string;
  original_vendor_name: string;
  pharmacy: string;
  price: number;
  product: string;
  quantity: number;
  status: string;
  vendor: string;
}

export interface IClassification {
  id: number;
  sales_per_day: number;
  value: string;
}

export interface IDrugStore {
  id: number;
  name: string;
}

export interface IRateItems {
  classification: IClassification;
  drug_store: IDrugStore;
}

export interface IOfferDrug {
  desired_increase: number;
  drug: {
    id: number;
    name: string;
  };
  id: number;
  offer: {
    id: number;
    name: string;
  };
  price: number;
}

export interface IOfferDrugStore {
  id: number;
  company_owner: boolean;
  drugstore: IDrugStore;
  is_agree: boolean;
  offer: IDrugStore;
}

export interface IBase {
  name: string;
  id: number;
}

export interface IProject extends IBase {
  status: string;
}

export interface IDrugstore {
  class_value: string;
  group_id: number;
  id: number;
  inn: string;
  name: string;
  nas_punkt: string;
  region: string;
}

export interface ICompanyDrugStores {
  company_owner: boolean;
  drugstore: IDrugstore;
  id: number;
  is_agree: string | null;
}

export interface ICompanyDrugs {
  desired_increase: null | number;
  drug: IBase;
  id: number;
  price: number;
}

export interface ICompetitor {
  company_drug: IBase;
  competitor_drugs: IBase[];
}

export interface IPlan {
  desired_increase: number;
  drug: IBase;
  id: number;
  price: number;
}
