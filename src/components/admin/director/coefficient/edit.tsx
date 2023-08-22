import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Form, Input, Select, SelectProps, Spin, message } from "antd";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSingleCoefficient, updateSingleCoefficient } from "./request";
import { ICompany, ICompanyForm } from "../../../../shared/types";
import { useForm } from "antd/es/form/Form";
import _, { debounce } from "lodash";
// import { getDrugStores } from "../users/request";
import { getCategory } from "../../company/setting/request";
import { getDrugs } from "../../../../shared/request";

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

async function fetchDrugs(value: string): Promise<ProjectValue[]> {
  const searchedDrugstores = await getDrugs({ name: value });
  const { items } = searchedDrugstores;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
}

const displayFormInputs = (label: string, key: string) => {
  return (
    <Form.Item
      label={label}
      name={key}
      rules={[{ required: true, message: `Please input ${label}!` }]}
    >
      <Input />
    </Form.Item>
  );
};

const Edit = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({});
  const [months] = useState([
    {
      label: "Январь",
      key: "january",
    },
    {
      label: "Февраль",
      key: "february",
    },
    {
      label: "Март",
      key: "march",
    },
    {
      label: "Апрель",
      key: "april",
    },
    {
      label: "Май",
      key: "may",
    },
    {
      label: "Июнь",
      key: "june",
    },
    {
      label: "Июль",
      key: "july",
    },
    {
      label: "Август",
      key: "august",
    },
    {
      label: "Сентябрь",
      key: "september",
    },
    {
      label: "Октябрь",
      key: "october",
    },
    {
      label: "Ноябрь",
      key: "november",
    },
    {
      label: "Декабрь",
      key: "december",
    },
  ]);
  // id: 9, username: '13212312', company_name: '123123', bitrix_id:
  const onFinish = async ({ drug, ...tempMonths }: any) => {
    setLoading(true);
    let changedData = {};
    const difference = ({ drug, id, ...initialMonths }: any, argMonth: any) => {
      Object.keys(initialMonths).forEach((key) => {
        if (initialMonths[key] != argMonth[key]) {
          changedData = {
            ...changedData,
            [key]: argMonth[key],
          };
        }
      });
      // return changedData;
    };
    difference(initialValues, tempMonths);
    if (drug.value !== initialValues.drug.value) {
      changedData = {
        ...changedData,
        drug_id: drug.value,
      };
    }

    if (Object.keys(changedData).length) {
      const request = await updateSingleCoefficient(id, changedData);
      if (request === 200) {
        navigate("/pharmacy-ceo/coefficient?page=1&page_size=20");
      }
    }
    setLoading(false);
  };

  const fetchRate = async () => {
    const request = await getSingleCoefficient(Number(id));
    if (request !== "error") {
      let data = {
        ...request,
        drug: {
          value: request.drug.id,
          label: request.drug.name,
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
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>
        Изменить Коэффициент
      </h3>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        disabled={isLoading}
      >
        <Form.Item
          label="Аптека"
          name="drug"
          rules={[{ required: true, message: "Please choose drugstore!" }]}
        >
          <DebounceSelect
            placeholder="Выберите аптеку"
            fetchOptions={fetchDrugs}
            // style={{ width: '24vw' }}
            showSearch
            allowClear
            loading={isLoading}
          />
        </Form.Item>
        <div className="coefficient-months">
          {months.map(({ label, key }: { label: string; key: string }) =>
            displayFormInputs(label, key)
          )}
        </div>
        <Form.Item>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/pharmacy-ceo/coefficient?page=1&page_size=20">
                Назад
              </Link>
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
