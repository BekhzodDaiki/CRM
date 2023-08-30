import { useState, useRef, useMemo } from "react";
import { Button, Form, Input, Select, SelectProps, Spin } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { createCompany, createOffer, getCompanies } from "./request";

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

async function fetchDrugstore(value: string): Promise<ProjectValue[]> {
  const searchedDrugstores = await getCompanies({ name: value });
  console.log("searchedDrugstores: ", searchedDrugstores);
  if (searchedDrugstores && searchedDrugstores.length) {
    return searchedDrugstores.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  }
  return [];
}

const CreateSingle = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const onFinish = async ({ company, name }: any) => {
    setLoading(true);
    console.log({company, name});
    const request = await createOffer({
      company_id: company.value,
      name,
      status: 'new'
    });
    setLoading(false);
    if (request === 201) {
      navigate(`/company/user/${id}/offers?page=1&page_size=20`);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Создать Оффер</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: "64vw" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Компания"
          name="company"
          rules={[{ required: true, message: "Please choose company!" }]}
        >
          <DebounceSelect
            placeholder="Выберите компанию"
            fetchOptions={fetchDrugstore}
            // style={{ width: '100%' }}
            showSearch
            allowClear
            loading={isLoading}
          />
        </Form.Item>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Статус">
          <div style={{ fontWeight: "bold", textDecoration: "underline" }}>
            New
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to={`/company/user/${id}/offers?page=1&page_size=20`}>
                Назад
              </Link>
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

export default CreateSingle;
