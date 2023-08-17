import { useState, useEffect, useMemo, useRef } from "react";
import { Button, Form, Input, Select, Spin, message } from "antd";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import type { SelectProps } from "antd/es/select";
import {
  getDrugStoreGroups,
  getSingleDirector,
  updateSingleDirector,
} from "./request";
import { ICompany, ICompanyForm } from "../../../../shared/types";
import { useForm } from "antd/es/form/Form";
import _ from "lodash";

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

    return _.debounce(loadOptions, debounceTimeout);
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
  const searchedDrugstores = await getDrugStoreGroups({ name: value });
  const { items } = searchedDrugstores;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
}

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isChange, setChange] = useState(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    drug_store_group: {
      id: -1,
      name: "",
    },
    username: "",
    id: -1,
  });

  const onFinish = async ({ password, username, drug_store_group }: any) => {
    // console.log("value: ", );
    setLoading(true);
    // console.log('passsss: ', password);
    let modifiedData = {
      user: {},
    };
    let isModified = false;
    if (initialValues.username !== username) {
      console.log('username');
      isModified = true;
      modifiedData = {
        user: {
          username,
        },
      };
    }
    if (isChange && initialValues.drug_store_group.id !== drug_store_group.value) {
      console.log('drug_store_group');
      isModified = true;
      modifiedData = {
        ...modifiedData,
        drug_store_group_id: drug_store_group.value,
      };
    }
    if (password) {
      console.log('password');
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
      const request = await updateSingleDirector(id, modifiedData);
      if (request === 200) {
        navigate('/pharmacy-ceo?page=1&page_size=20')
      }
    }
    setLoading(false);
  };

  const fetchSingleDirector = async () => {
    const request = await getSingleDirector(Number(id));
    setInitialValues(request);
    form.setFieldsValue(request);
    form.setFieldValue("name", request.company_name);
  };

  useEffect(() => {
    fetchSingleDirector();
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="edit-form-wrapper">
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>
        Изменить Диретора Аптек
      </h3>
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
        <Form.Item label="Drug store group" name="drug_store_group">
          {isChange ? (
            <DebounceSelect
              placeholder="Выберите..."
              fetchOptions={fetchDrugstores}
              style={{ width: "64%" }}
              showSearch
              allowClear
              loading={isLoading}
            />
          ) : (
            <div>
              <div style={{ marginRight: 8, fontWeight: "bold" }}>
                {" "}
                {initialValues.drug_store_group.name}
              </div>
              <Button type="dashed" onClick={() => setChange(true)}>
                Изменить
              </Button>
            </div>
          )}
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Пароль" name="password">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/company?page=1&page_size=20">Назад</Link>
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
