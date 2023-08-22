import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Form, Input, Select, SelectProps, Spin, message } from "antd";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSingleRate, updateSingleRate } from "./request";
import { ICompany, ICompanyForm } from "../../../../shared/types";
import { useForm } from "antd/es/form/Form";
import _, { debounce } from "lodash";
import { getDrugStores } from "../users/request";
import { getCategory } from "../../company/setting/request";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect
interface ProjectValue {
  label: string;
  value: string;
}

async function fetchDrugstores(value: string): Promise<ProjectValue[]> {
  const searchedDrugstores = await getDrugStores({ name: value });
  if (searchedDrugstores && searchedDrugstores.items) {
    const { items } = searchedDrugstores;
    return items.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  }
  return [];
}

async function fetchClassification(value: string): Promise<ProjectValue[]> {
  const searchedDrugstores = await getCategory({ value });
  if (searchedDrugstores && searchedDrugstores.items) {
    const { items } = searchedDrugstores;
    return items.map((item: any) => ({
      label: item.value,
      value: item.id,
    }));
  }
  return [];
}

const Edit = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({});
  // id: 9, username: '13212312', company_name: '123123', bitrix_id:
  const onFinish = async ({ drug_store, classification }: any) => {
    setLoading(true);
    let changedData = {};
    if (drug_store.value !== initialValues.drug_store.value) {
      changedData = {
        drug_store_id: drug_store.value,
      };
    }
    if (classification.value !== initialValues.classification.value) {
      changedData = {
        ...changedData,
        classification_id: classification.value,
      };
    }

    if (Object.keys(changedData).length) {
      const request = await updateSingleRate(id, changedData);
      console.log("requestttt: ", request);
      if (request === 200) {
        navigate("/admin-pharmacy/rate?page=1&page_size=20");
      }
    }
    setLoading(false);
  };

  const fetchRate = async () => {
    const request = await getSingleRate(Number(id));
    if (request !== "error") {
      let data = {
        classification: {
          value: request.classification.id,
          label: request.classification.value,
        },
        drug_store: {
          value: request.drug_store.id,
          label: request.drug_store.name,
        },
      };
      setInitialValues(data);
      form.setFieldsValue(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchRate();
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="edit-form-wrapper">
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>Изменить Оценку</h3>
      <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        // style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        disabled={isLoading}
      >
        <Form.Item
          label="Аптека"
          name="drug_store"
          rules={[{ required: true, message: "Please choose drugstore!" }]}
        >
          <DebounceSelect
            placeholder="Выберите аптеку"
            fetchOptions={fetchDrugstores}
            style={{ width: "24vw" }}
            showSearch
            allowClear
            loading={isLoading}
          />
        </Form.Item>
        <Form.Item
          label="Классификация"
          name="classification"
          rules={[{ required: true, message: "Please choose classification!" }]}
        >
          <DebounceSelect
            placeholder="Выберите класификацию"
            fetchOptions={fetchClassification}
            // style={{ width: '100%' }}
            showSearch
            allowClear
            loading={isLoading}
          />
        </Form.Item>

        <Form.Item>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/admin-pharmacy/rate?page=1&page_size=20">Назад</Link>
            </Button>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Изменить
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Edit;
