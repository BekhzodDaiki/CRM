import { Button, Form, Input, Select, Spin, message } from "antd";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createCompany, createPharmacyDirector, getDrugStoreGroups } from "./request";
import type { SelectProps } from 'antd/es/select';
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { ICompany, ICompanyForm } from "../../../../shared/types";
import debounce from 'lodash/debounce';
import FormItem from "antd/es/form/FormItem";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const [searchParams] = useSearchParams();
  const fetchRef = useRef(0);

  // const getListProject = useCallback(async () => {
  //   const request = await getOffers(Object.fromEntries(searchParams.entries()));
  //   setOptions(request.items.map((item: any) => ({
  //     label: item.name,
  //     value: item.id
  //   })));
  // }, [options]);

  // useEffect(() => {
  //   getListProject();
  // }, []);

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


type FieldType = {
  username?: string;
  password?: string;
  name?: string;
  bitrix_id?: string;
};

// Usage of DebounceSelect
interface ProjectValue {
  label: string;
  value: string;
}

async function fetchGroupOwners(value: string): Promise<ProjectValue[]> {
  const searchedDrugstores = await getDrugStoreGroups({ name: value });
  const { items } = searchedDrugstores;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id
  }))
}

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();


  const onFinish = async ({
    password,
    username,
    drug_store_group_id
  }: any) => {

    setLoading(true);
    const request = await createPharmacyDirector({
      user: {
        password,
        username,
      },
      drug_store_group_id: drug_store_group_id.value
    });
    setLoading(false);
    if (request === 201) {
      navigate('/pharmacy-ceo?page=1&page_size=20');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Создать Директора Аптек</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <FormItem
          label="Drugstore Group"
          name="drug_store_group_id"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <DebounceSelect
            placeholder="Выберите..."
            fetchOptions={fetchGroupOwners}
            style={{ width: '64%' }}
            showSearch
            allowClear
            loading={isLoading}
          />
        </FormItem>
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/pharmacy-ceo?page=1&page_size=20">Назад</Link>
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
