import { useEffect, useState, useRef, useMemo } from "react";
import {
  createCompetitorDrug,
  deleteCompetitorDrugs,
  editCompetitorDrugs,
  getCompetitors,
  getDrugs,
} from "./request";
import { useSearchParams } from "react-router-dom";
import { ColumnsType } from "antd/lib/table";
import { IBase, ICompanyDrugs, ICompetitor } from "../../shared/types";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CloseOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";

const { Text, Link } = Typography;

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

async function fetchProjects(value: string): Promise<ProjectValue[]> {
  const searchedDrug = await getDrugs({ name: value });
  const { items } = searchedDrug;
  return items.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
}

const Competitor = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [competitorList, setCompetitorList] = useState({
    items: [],
    page: 1,
    size: 20,
    total: 0,
  });
  const [tagLoading, setTagLoading] = useState({
    isLoading: false,
    activeId: 0,
  });
  const [searchedValue, setSearchedValue] = useState({
    label: "",
    value: "",
    id: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createDrug, setDrug] = useState({
    company_drug_id: 0,
    competitor_drugs: [],
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (createDrug.company_drug_id && createDrug.competitor_drugs.length) {
      setConfirmLoading(true);
      await createCompetitorDrug(createDrug);
      setConfirmLoading(false);
      setIsModalOpen(false);
      setDrug({
        company_drug_id: 0,
        competitor_drugs: [],
      });
      getCompetitorList();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getCompetitorList = async () => {
    const request = await getCompetitors(
      Object.fromEntries(searchParams.entries())
    );
    setCompetitorList(request);
  };
  useEffect(() => {
    getCompetitorList();
  }, []);

  const log = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
  };

  const confirm = async (drugId: number) => {
    setLoading(true);
    await deleteCompetitorDrugs(drugId);
    setLoading(false);
    getCompetitorList();
  };

  const cancel = () => {};

  const modifyCompetitorDrugs = async (
    id: number,
    companyDrugId: number,
    competitor_drugs: any
  ) => {
    setLoading(true);
     await editCompetitorDrugs(id, {
      company_drug_id: companyDrugId,
      competitor_drugs,
    });
    setLoading(false);
    getCompetitorList();
  };

  return (
    <div className="competitor">
      <div>
        <Modal
          title="Создать Лекартсво"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
        >
          <div className="competitor-search">
            <div>
              <Text>Выберите лекарство компании: </Text>
              <br />
              <DebounceSelect
                placeholder="Выберите лекарство"
                fetchOptions={fetchProjects}
                onChange={async (newValue) => {
                  setDrug({
                    // @ts-ignore
                    company_drug_id: newValue.value,
                    competitor_drugs: createDrug.competitor_drugs,
                  });
                }}
                style={{ width: "24vw", marginRight: 8 }}
                showSearch
                allowClear
                loading={isLoading}
              />
            </div>
            <hr />
            <div>
              <Text>Выберите конкурента: </Text>
              <br />
              <DebounceSelect
                placeholder="Выберите лекарство"
                fetchOptions={fetchProjects}
                onChange={async (newValue) => {
                  setDrug({
                    company_drug_id: createDrug.company_drug_id,
                    // @ts-ignore
                    competitor_drugs: [newValue.value],
                  });
                }}
                style={{ width: "24vw", marginRight: 8 }}
                showSearch
                allowClear
                loading={isLoading}
              />
            </div>
          </div>
        </Modal>
        <Button
          type="primary"
          ghost
          icon={<PlusCircleOutlined />}
          onClick={showModal}
        >
          Создать Лекартсво
        </Button>
      </div>
      {competitorList.items.map(
        ({ company_drug, competitor_drugs, id }: any) => {
          return (
            <div key={company_drug.id} className="competitor-card">
              <div className="competitor-title-button-wrapper">
                <Text mark>
                  {company_drug.id} - {company_drug.name}
                </Text>
                <Popconfirm
                  title="Хотите удалить?"
                  onConfirm={() => confirm(id)}
                  onCancel={() => cancel()}
                  okText="ДА"
                  cancelText="НЕТ"
                >
                  <Button danger>Удалить</Button>
                </Popconfirm>
              </div>
              <div>
                <div className="competitor-choose-text">
                  Укажите ваши конкуренты:
                </div>
                <div className="competitor-search">
                  <DebounceSelect
                    placeholder="Выберите лекарство"
                    fetchOptions={fetchProjects}
                    onChange={async (newValue) => {
                      // @ts-ignore
                      setSearchedValue({
                        ...newValue,
                        // @ts-ignore
                        id: newValue.value,
                      });
                    }}
                    style={{ width: "36vw", marginRight: 8 }}
                    showSearch
                    allowClear
                    loading={isLoading}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      const modifiedData = [
                        ...competitor_drugs.map(({ id }: IBase) => id),
                        searchedValue.value,
                      ];
                      modifyCompetitorDrugs(id, company_drug.id, modifiedData);
                    }}
                    disabled={isLoading}
                  >
                    Добавить
                  </Button>
                </div>
                <div className="competitor-list">
                  {competitor_drugs.map((drug: any) => (
                    <div key={drug.id} className="custom-tag">
                      {drug.name}
                      {tagLoading.isLoading &&
                      tagLoading.activeId === drug.id ? (
                        <LoadingOutlined className="close-icon" />
                      ) : (
                        <CloseOutlined
                          className="close-icon"
                          onClick={() => {
                            setTagLoading({
                              isLoading: true,
                              activeId: drug.id,
                            });
                            const modifiedData = competitor_drugs.filter(
                              (cDrug: any) => {
                                console.log(cDrug);
                                if (cDrug.id !== drug.id) {
                                  return cDrug.id;
                                }
                              }
                            );
                            modifyCompetitorDrugs(
                              id,
                              company_drug.id,
                              modifiedData.map((drug: any) => drug.id)
                            );
                            setTagLoading({
                              isLoading: false,
                              activeId: 0,
                            });
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Competitor;
