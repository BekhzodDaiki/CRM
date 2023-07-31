import { ColumnsType, TableProps } from "antd/es/table";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IProject } from "../../shared/types";
import { bindDrugsToUser, getOffers } from "./request";
import {
  Button,
  Input,
  Table,
  Tabs
} from "antd";
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';

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

  const getListProject = useCallback(async () => {
    const request = await getOffers(Object.fromEntries(searchParams.entries()));
    setOptions(request.items.map((item: any) => ({
      label: item.name,
      value: item.id
    })));
  }, [options]);

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

async function fetchCompanyProjects(value: string): Promise<ProjectValue[]> {
  const searchedProjects = await getOffers({ name: value });
  // const searchedDrug = await getOffers({ name: value });
  const { items } = searchedProjects;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id
  }))
}


const CompanyProject = ({ onChange, value }: any) => {
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  // const [value, setValue] = useState<ProjectValue[]>([]);

  // const [projectList, setProject] = useState({
  //   items: [],
  //   page: 1,
  //   size: 20,
  //   total: 0,
  // });

  // const getListProject = async () => {
  //   const request = await getOffers();
  //   // setProject(request);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   getListProject();
  // }, [searchParams]);


  return (
    <DebounceSelect
      value={value}
      placeholder="Выберите проект"
      fetchOptions={fetchCompanyProjects}
      onChange={onChange}
      style={{ width: '64%' }}
      showSearch
      allowClear
      loading={isLoading}
    />
  );
};

export default CompanyProject;