import { Button, Form, Input, Select, SelectProps, Spin } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { createCoefficient } from "./request";
import { debounce } from "lodash";
// import { getDrugStores } from "../users/request";
import { getCategory } from "../../company/setting/request";
import { getDrugs } from "../../../../shared/request";

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
    value: item.id
  }))
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
}

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [months] = useState([
    {
      label: 'Январь',
      key: 'january',
    },
    {
      label: 'Февраль',
      key: 'february',
    },
    {
      label: 'Март',
      key: 'march',
    },
    {
      label: 'Апрель',
      key: 'april',
    },
    {
      label: 'Май',
      key: 'may',
    },
    {
      label: 'Июнь',
      key: 'june',
    },
    {
      label: 'Июль',
      key: 'july',
    },
    {
      label: 'Август',
      key: 'august',
    },
    {
      label: 'Сентябрь',
      key: 'september',
    },
    {
      label: 'Октябрь',
      key: 'october',
    },
    {
      label: 'Ноябрь',
      key: 'november',
    },
    {
      label: 'Декабрь',
      key: 'december',
    },
  ]);

  const onFinish = async ({
    drug,
    ...rest
  }: any) => {
    setLoading(true);
    const request = await createCoefficient({
      drug_id: drug.value,
      ...rest,
    });
    setLoading(false);
    if (request === 201) {
      navigate('/pharmacy-ceo/coefficient?page=1&page_size=20');
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
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: '64vw' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Лекарство"
          name="drug"
          rules={[{ required: true, message: "Please choose drug!" }]}
        >
          <DebounceSelect
            placeholder="Выберите лекарство"
            fetchOptions={fetchDrugs}
            // style={{ width: '100%' }}
            showSearch
            allowClear
            loading={isLoading}
          />
        </Form.Item>
        <div className="coefficient-months">
          {months.map(({ label, key }: { label: string, key: string }) => (displayFormInputs(label, key)))}
        </div>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/pharmacy-ceo/coefficient?page=1&page_size=20">Назад</Link>
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
