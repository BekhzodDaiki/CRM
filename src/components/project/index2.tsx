import { ColumnsType, TableProps } from "antd/es/table";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IProject } from "../../shared/types";
import { bindDrugsToUser, getOffers } from "./request";
import {
  Button,
  Input,
  Table,
  Tabs
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import Pharmacy from "./pharmacy";
import Pill from "./pill";

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

  const getListProject = async () => {
    const request = await getOffers(Object.fromEntries(searchParams.entries()));
    setOptions(request.items.map((item: any) => ({
      label: item.name,
      value: item.id
    })));
  };

  useEffect(() => {
    getListProject();
  }, []);

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

async function fetchProjects(value: string): Promise<ProjectValue[]> {
  const searchedDrug = await getOffers({ name: value });
  const { items } = searchedDrug;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id
  }))
}


const Project = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState<ProjectValue[]>([]);
  const [tabKey, setTabKey] = useState('pills');

  const [projectList, setProject] = useState({
    items: [],
    page: 1,
    size: 20,
    total: 0,
  });

  const getListProject = async () => {
    const request = await getOffers();
    setProject(request);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getListProject();
  }, [searchParams]);


  const onChangeTab = (key: string) => {
    setTabKey(key);
    console.log('key: ', key);
    navigate('/project?page=1&size=20');
  };

  return (
    <div>
      <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
      }}>
        Мои проекты
      </p>
      <div
        style={{
          paddingBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <DebounceSelect
          value={value}
          placeholder="Select project"
          fetchOptions={fetchProjects}
          onChange={async (newValue) => {
            setValue(newValue as ProjectValue[]);
            // @ts-ignore
            // await getSingleOffer(newValue.value)
          }}
          style={{ width: '80%' }}
          showSearch
          allowClear
        />
      </div>
      <Tabs
        onChange={onChangeTab}
        type="card"
        defaultActiveKey="pills"
        items={[
          {
            label: 'Мои Лекарство',
            key: 'pills',
            children:  <Pill  tabKey={tabKey} id={value && value.key ? value.key : null} />,
          },
          {
            label: 'Мои Аптеки',
            key: 'pharmacy',
            children: <Pharmacy tabKey={tabKey} id={value && value.key ? value.key : null} />,
          }
        ]}
      />
    </div>
  );
};

export default Project;