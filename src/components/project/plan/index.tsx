import { useEffect, useState } from "react";
import RowSelectionTable from "../../../shared/RowSelectionTable";
import { ColumnsType, TableProps } from "antd/es/table";
import { getDrugRecepits, getPlanList } from "../request";
import CompanyProject from "..";
import _ from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IBase, ICompanyDrugs, IPlan } from "../../../shared/types";
import { Input, Modal, Popconfirm, Spin, Switch } from "antd";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { SpinnerDotted } from "spinners-react";

const Plan = () => {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState({
    value: 0,
    label: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [planList, setPlanList] = useState({
    page: 1,
    size: 20,
    total: 0,
    items: [],
  });
  const [isPacked, setPacked] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPlan = async () => {
    const request1 = await getPlanList(
      selectedProjectId.value,
      Object.fromEntries(searchParams.entries())
    );

    // const request2 = await getDrugRecepits(
    //   selectedProjectId.value,
    //   Object.fromEntries(searchParams.entries())
    // );
    // const test = request1.items.filter((item: any) => {
    //   return request2.items.filter((drug: any) => {
    //     console.log(item, drug)
    //     if (item.drug.id === drug.drug_id) {
    //       return {
    //         ...item,
    //         ...drug
    //       }
    //     }
    //   })
    // })
    // console.log('test: ', test);
    // setPlanList({...request1, items: [...request1.items, ...request2.items]});
    setPlanList(request1);
    setLoading(false);
  };

  const confirm = async (id: number) => {
    setLoading(true);
    await removeCompanyDrug(id);
    getPlan();
    setLoading(false);
  };
  // console.log('ddd: ', planList.items);
  const columns: ColumnsType<IPlan> = [
    {
      title: "Наименование",
      dataIndex: "drug",
      render: ({ name }: IBase) => name,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <Input disabled={true} type="number" defaultValue={price} />
      ),
    },
    {
      title: "Прирост",
      dataIndex: "desired_increase",
      render: (desired_increase) => (
        <Input disabled={true} type="number" defaultValue={desired_increase} />
      ),
    },
    {
      title: "Факт закупа с аптек в год",
      dataIndex: isPacked ? "avg_purchase" : "avg_profit",
    },
    {
      title: "Прирост",
      dataIndex: isPacked
        ? "avg_purchase_with_desired_increase-avg_purchase"
        : "avg_profit_with_desired_increase-avg_profit",
    },
    {
      title: "Всего",
      dataIndex: isPacked
        ? "avg_purchase_with_desired_increase"
        : "avg_profit_with_desired_increase",
    },
    {
      title: "Действие",
      render: ({ id }: ICompanyDrugs) => {
        return (
          <EditOutlined
            style={{ fontSize: "24px" }}
            color="#fadb14"
            onClick={showModal}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (selectedProjectId && selectedProjectId.value) {
      setLoading(true);
      getPlan();
    } else {
      setPlanList({
        page: 1,
        size: 20,
        total: 0,
        items: [],
      });
    }
  }, [selectedProjectId, searchParams]);

  const onChangePillTable: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/project/plan?page=${current}&size=20`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>

      <div style={{ marginBottom: 8 }}>
        <span style={{ marginRight: 8 }}>Выберите проект: </span>
        <CompanyProject
          onChange={setSelectedProjectId}
          value={selectedProjectId}
        />
      </div>
      {selectedProjectId && selectedProjectId.value ? (
        <div
          style={{ marginTop: 16, marginBottom: 16 }}
          className="filter-button"
        >
          <Switch
            checkedChildren="В упаковках"
            unCheckedChildren="В сумах"
            checked={isPacked}
            onChange={(isPacked: boolean) => setPacked(isPacked)}
          />
        </div>
      ) : null}
      {/* <div>
        <SpinnerDotted size={50} thickness={100} speed={100} color="#1890ff" />
      </div> */}
      <Spin spinning={isLoading} tip="Грууузитсяя">
        <RowSelectionTable
          columns={columns}
          dataList={planList.items || []}
          dataType={null}
          onChange={onChangePillTable}
          isLoading={isLoading}
          data={planList}
          // setSelected={setSelected}
          current={Number(searchParams.get("page"))}
          rowSelection={false}
          height={"50vh"}
        />
      </Spin>

    </>
  );
};

export default Plan;
