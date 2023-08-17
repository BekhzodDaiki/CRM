import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Form, Input, Select, Spin, message } from "antd";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getSinglePharmacy,
  getDrugStores,
  updateSinglePharmacy,
} from "./request";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import { ICompany, ICompanyForm } from "../../../../shared/types";
import { useForm } from "antd/es/form/Form";
import _ from "lodash";
import { CloseOutlined } from "@ant-design/icons";

type FieldType = {
  username?: string;
  password?: string;
  name?: string;
  bitrix_id?: string;
};

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

// Usage of DebounceSelect
interface ProjectValue {
  label: string;
  value: string;
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

async function fetchDrugstores(value: string): Promise<ProjectValue[]> {
  const searchedDrugstores = await getDrugStores({ name: value });
  const { items } = searchedDrugstores;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
}

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isChange, setChange] = useState(false);
  const [initialValues, setInitialValues] = useState({
    drug_store: { name: "" },
    id: -1,
    username: "",
  });

  // id: 9, username: '13212312', company_name: '123123', bitrix_id:
  const onFinish = async ({ drug_store, password, username }: any) => {
    setLoading(true);
    // console.log("values: ", values);
    let modifiedData = {
      user: {},
    };
    let isModified = false;
    if (drug_store && initialValues.drug_store.name !== drug_store.value) {
      isModified = true;
      modifiedData = {
        drug_store_id: drug_store.value,
      };
    }
    if (initialValues.username !== username) {
      isModified = true;
      modifiedData = {
        ...modifiedData,
        user: {
          username,
        },
      };
    }

    if (password) {
      isModified = true;
      modifiedData = {
        ...modifiedData,
        user: {
          ...modifiedData.user,
          password,
        },
      };
    }
    if (isModified) {
      const request = await updateSinglePharmacy(Number(id), modifiedData);
      if (request === 200) {
        navigate("/admin-pharmacy?page=1&page_size=20");
      }
    }
    setLoading(false);
  };

  const fetchPharmacy = async () => {
    const request = await getSinglePharmacy(Number(id));
    setInitialValues(request);
    console.log("reqqq: ", request);
    form.setFieldValue("username", request.username);
  };

  useEffect(() => {
    fetchPharmacy();
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="edit-form-wrapper">
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>Изменить Аптеку</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        disabled={isLoading}
      >
        <Form.Item label="Drugstore" name="drug_store">
          {isChange ? (
            <DebounceSelect
              placeholder="Выберите аптеку"
              fetchOptions={fetchDrugstores}
              style={{ width: "64%" }}
              showSearch
              allowClear
              loading={isLoading}
            />
          ) : (
            <div>
              {initialValues.drug_store.name}
              <Button type="dashed" onClick={() => setChange(true)}>
                Изменить
              </Button>
            </div>
          )}
        </Form.Item>
        <Form.Item<FieldType> label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Пароль" name="password">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/admin-pharmacy?page=1&page_size=20">Назад</Link>
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
