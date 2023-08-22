import { Button, Form, Input, Select, SelectProps, Spin } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { createRate } from "./request";
import { debounce } from "lodash";
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
  const [searchParams] = useSearchParams();
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

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async ({ drug_store, classification }: any) => {
    setLoading(true);
    const request = await createRate({
      drug_store_id: drug_store.value,
      classification_id: classification.value,
    });
    setLoading(false);
    if (request === 201) {
      navigate("/admin-pharmacy/rate?page=1&page_size=20");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Создать Оценку</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Drugstore"
          name="drug_store"
          rules={[{ required: true, message: "Please choose drugstore!" }]}
        >
          <DebounceSelect
            placeholder="Выберите аптеку"
            fetchOptions={fetchDrugstores}
            // style={{ width: '100%' }}
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/admin-pharmacy/rate?page=1&page_size=20">Назад</Link>
            </Button>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Создать
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;
