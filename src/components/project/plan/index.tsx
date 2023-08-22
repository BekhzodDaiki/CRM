import { useEffect, useMemo, useState } from "react";
import RowSelectionTable from "../../../shared/RowSelectionTable";
import { ColumnsType, TableProps } from "antd/es/table";
import { getDrugRecepits, getPlanList, updatePriceNDesire } from "../request";
import CompanyProject from "..";
import _ from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IBase, ICompanyDrugs, IPlan } from "../../../shared/types";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Spin,
  Switch,
  message,
} from "antd";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { SpinnerDotted } from "spinners-react";
import moment from "moment";
import { useForm } from "antd/lib/form/Form";

const Plan = () => {
  const navigate = useNavigate();
  const [form] = useForm();
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
  const [isMonthly, setMonthly] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState({
    // offerId: -1,
    offerDrugId: -1,
    price: 0,
    desired_increase: 0,
  });

  const getPlan = async () => {
    const request1 = await getPlanList(
      selectedProjectId.value,
      Object.fromEntries(searchParams.entries())
    );
    if (request1 !== "error") {
      let temp = request1.items.reduce(
        (acc: any, { receipts_avg, ...rest }: any) => {
          return [
            ...acc,
            {
              ...rest,
              ...receipts_avg,
            },
          ];
        },
        []
      );
      setPlanList({ ...request1, items: temp });
    }

    setLoading(false);
  };

  const columnQuarter = [
    {
      title: moment().year(),
      children: [
        {
          title: 1,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(dates[moment().year()]);
              if (certain[0] === 0) {
                return null;
              }
              return isPacked ? certain[0] : certain[0].toLocaleString();
            }
            return null;
          },
          // render: (dates) => {
          //   return Object.values(dates[moment().year()])[0];
          // }
        },
        {
          title: 2,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(dates[moment().year()]);
              if (certain[1] === 0) {
                return null;
              }
              return isPacked ? certain[1] : certain[1].toLocaleString();
            }
            return null;
          },
        },
        {
          title: 3,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(dates[moment().year()]);
              if (certain[2] === 0) {
                return null;
              }
              return isPacked ? certain[2] : certain[2].toLocaleString();
            }
            return null;
          },
        },
        {
          title: 4,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(dates[moment().year()]);
              if (certain[3] === 0) {
                return null;
              }
              return isPacked ? certain[3] : certain[3].toLocaleString();
            }
            return null;
          },
          // render: (dates) => {
        },
      ],
    },
    {
      title: moment().add(1, "year").year(),
      children: [
        {
          title: 1,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(
                dates[moment().add(1, "year").year()]
              );
              if (certain[0] === 0) {
                return null;
              }
              return isPacked ? certain[0] : certain[0].toLocaleString();
            }
            return null;
          },
          // render: (dates) => {
          //   return Object.values(dates[moment().add(1, "year").year()])[0];
          // },
        },
        {
          title: 2,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(
                dates[moment().add(1, "year").year()]
              );
              if (certain[1] === 0) {
                return null;
              }
              return isPacked ? certain[1] : certain[1].toLocaleString();
            }
            return null;
          },
        },
        {
          title: 3,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(
                dates[moment().add(1, "year").year()]
              );
              if (certain[2] === 0) {
                return null;
              }
              return isPacked ? certain[2] : certain[2].toLocaleString();
            }
            return null;
          },
        },
        {
          title: 4,
          dataIndex: isPacked ? "purchase_quarters" : "profit_quarters",
          // @ts-ignore
          render: (dates) => {
            if (dates) {
              let certain = Object.values(
                dates[moment().add(1, "year").year()]
              );
              if (certain[3] === 0) {
                return null;
              }
              return isPacked ? certain[3] : certain[3].toLocaleString();
            }
            return null;
          },
        },
      ],
    },
  ];

  const columnMonth = [
    {
      title: "Факт закупа с аптек в год",
      dataIndex: isPacked ? "avg_purchase" : "avg_profit",
      // render: ({ avg_purchase, avg_profit }) =>
      //   isPacked ? avg_purchase : avg_profit.toLocaleString(),
    },
    {
      title: moment().add(1, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        if (date) {
          return date && Object.values(date)
            ? isPacked
              ? Object.values(date)[0]
              : Object.values(date)[0].toLocaleString()
            : null;
        }
        return null;
      },
    },
    {
      title: moment().add(2, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        if (date) {
          return date && Object.values(date)
            ? isPacked
              ? Object.values(date)[1]
              : Object.values(date)[1].toLocaleString()
            : null;
        }
        return null;

        // let certain = moment().add(2, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(3, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        if (date) {
          return date && Object.values(date)
            ? isPacked
              ? Object.values(date)[2]
              : Object.values(date)[2].toLocaleString()
            : null;
        }
        return null;
        // return date && Object.values(date) ? Object.values(date)[2] : null;
        // let certain = moment().add(3, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(4, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        if (date) {
          return date && Object.values(date)
            ? isPacked
              ? Object.values(date)[3]
              : Object.values(date)[3].toLocaleString()
            : null;
        }
        return null;
        // return date && Object.values(date) ? Object.values(date)[3] : null;
        // let certain = moment().add(4, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(5, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        if (date) {
          return date && Object.values(date)
            ? isPacked
              ? Object.values(date)[4]
              : Object.values(date)[4].toLocaleString()
            : null;
        }
        return null;
        // return date && Object.values(date) ? Object.values(date)[4] : null;
        // let certain = moment().add(5, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(6, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        if (date) {
          return date && Object.values(date)
            ? isPacked
              ? Object.values(date)[5]
              : Object.values(date)[5].toLocaleString()
            : null;
        }
        return null;
        // return date && Object.values(date) ? Object.values(date)[5] : null;
        // let certain = moment().add(6, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(7, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        return date && Object.values(date)
          ? isPacked
            ? Object.values(date)[6]
            : Object.values(date)[6].toLocaleString()
          : null;
        // return date && Object.values(date) ? Object.values(date)[6] : null;
        // let certain = moment().add(7, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(8, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        return date && Object.values(date)
          ? isPacked
            ? Object.values(date)[7]
            : Object.values(date)[7].toLocaleString()
          : null;
        // return date && Object.values(date) ? Object.values(date)[7] : null;
        // let certain = moment().add(8, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(9, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        return date && Object.values(date)
          ? isPacked
            ? Object.values(date)[8]
            : Object.values(date)[8].toLocaleString()
          : null;
        // return date && Object.values(date) ? Object.values(date)[8] : null;
        // let certain = moment().add(9, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(10, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        return date && Object.values(date)
          ? isPacked
            ? Object.values(date)[9]
            : Object.values(date)[9].toLocaleString()
          : null;
        // return date && Object.values(date) ? Object.values(date)[9] : null;
        // let certain = moment().add(10, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(11, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        return date && Object.values(date)
          ? isPacked
            ? Object.values(date)[10]
            : Object.values(date)[10].toLocaleString()
          : null;
        // return date && Object.values(date) ? Object.values(date)[10] : null;
        // let certain = moment().add(11, "months").month();
        // return displayDates(date, certain);
      },
    },
    {
      title: moment().add(12, "months").format("MMMM"),
      dataIndex: isPacked ? "purchase_months" : "profit_months",
      render: (date: any) => {
        return date && Object.values(date)
          ? isPacked
            ? Object.values(date)[11]
            : Object.values(date)[11].toLocaleString()
          : null;
        // return date && Object.values(date) ? Object.values(date)[11] : null;
        // let certain = moment().add(12, "months").month();
        // return displayDates(date, certain);
      },
    },
  ];

  const columns: ColumnsType<IPlan> = [
    {
      title: "Наименование",
      dataIndex: "drug",
      width: 200,
      fixed: "left",
      render: ({ name }: IBase) => name,
    },
    {
      title: "Цена",
      dataIndex: "price",
      render: (price) => <Input disabled={true} type="number" value={price} />,
    },
    {
      title: "Прирост",
      dataIndex: "desired_increase",
      render: (desired_increase) => {
        let desire = desired_increase * 100;
        return <Input disabled={true} value={desire} suffix="%" />;
      },
    },
    {
      title: "Прирост",
      dataIndex: isPacked
        ? "avg_purchase_with_desired_increase"
        : "avg_profit_with_desired_increase",
      render: (desire) =>
        desire ? (isPacked ? desire : desire.toLocaleString()) : null,
      // render: ({
      //   avg_purchase_with_desired_increase,
      //   avg_profit_with_desired_increase,
      // }) =>
      //   isPacked
      //     ? avg_purchase_with_desired_increase
      //     : avg_profit_with_desired_increase.toLocaleString(),
    },
    // {
    //   title: "Всего",
    //   dataIndex: isPacked
    //     ? "avg_purchase_with_desired_increase"
    //     : "avg_profit_with_desired_increase",
    // },
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

  const onChangePlanTable: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/project/plan?page=${current}&size=20`);
  };

  const showModal = ({
    drugId,
    price,
    desired_increase,
  }: {
    drugId: number;
    price: number;
    desired_increase: number;
  }) => {
    setIsModalOpen(true);
    setSelectedIds({
      offerDrugId: drugId,
      price,
      desired_increase,
    });
  };

  const handleOk = async () => {
    // setIsModalOpen(false);
    setLoading(true);
    const request = await updatePriceNDesire(
      selectedProjectId.value,
      selectedIds.offerDrugId,
      {
        price: selectedIds.price,
        desired_increase: selectedIds.desired_increase,
      }
    );
    if (request === 200) {
      getPlan();
      message.success("Успешно изменено");
      setIsModalOpen(false);
    } else {
      message.error("Не удалось изменить");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const displayColumns = useMemo(() => {
    return () => (isMonthly ? columnMonth : columnQuarter);
  }, [isMonthly]);

  useEffect(() => {
    if (selectedIds.offerDrugId) {
      form.setFieldsValue(selectedIds);
    }
  }, [selectedIds]);

  return (
    <>
      <Modal
        title="Изменить цену и/или прирост"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleOk}
          >
            Изменить
          </Button>,
        ]}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ marginRight: 8 }}>Цена: </span>
          <Input
            onChange={({ target: { value } }) => {
              setSelectedIds((values: any) => ({
                ...values,
                price: value,
              }));
            }}
            value={selectedIds.price}
            type="number"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <span style={{ marginRight: 8 }}>Прирост:</span>
          <Input
            onChange={({ target: { value } }) => {
              setSelectedIds((values: any) => ({
                ...values,
                desired_increase: value,
              }));
            }}
            value={selectedIds.desired_increase}
            type="number"
          />
        </div>
      </Modal>

      <div style={{ marginBottom: 8 }}>
        <span style={{ marginRight: 8 }}>Выберите проект: </span>
        <CompanyProject
          onChange={setSelectedProjectId}
          value={selectedProjectId}
        />
      </div>
      {selectedProjectId && selectedProjectId.value ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
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
          <div
            style={{ marginTop: 16, marginBottom: 16 }}
            className="filter-button"
          >
            <Switch
              checkedChildren="Помесячно"
              unCheckedChildren="Поквартально"
              checked={isMonthly}
              onChange={(monthly: boolean) => setMonthly(monthly)}
            />
          </div>
        </div>
      ) : null}
      {/* <div>
        <SpinnerDotted size={50} thickness={100} speed={100} color="#1890ff" />
      </div> */}
      <Spin spinning={isLoading} tip="Грууузитсяя">
        <RowSelectionTable
          columns={[
            ...columns,
            ...displayColumns(),
            {
              title: "Действие",
              fixed: "right",
              render: ({
                id,
                drug,
                price,
                desired_increase,
              }: ICompanyDrugs) => {
                return (
                  <EditOutlined
                    style={{ fontSize: "24px" }}
                    color="#fadb14"
                    onClick={() => {
                      showModal({
                        drugId: id,
                        price: price ? price : null,
                        desired_increase: desired_increase
                          ? desired_increase
                          : null,
                      });
                    }}
                  />
                );
              },
            },
          ]}
          // columns={
          //   isMonthly
          //     ? [
          //         ...columns,
          //         ...columnMonth,
          //         {
          //           title: "Действие",
          //           render: ({ id, drug }: ICompanyDrugs) => {
          //             setSelectedIds((values) => {
          //               return {
          //                 ...values,
          //                 offerId: id,
          //                 offerDrugId: drug.id,
          //               };
          //             });
          //             return (
          //               <EditOutlined
          //                 style={{ fontSize: "24px" }}
          //                 color="#fadb14"
          //                 onClick={showModal}
          //               />
          //             );
          //           },
          //         },
          //       ]
          //     : [
          //         ...columns,
          //         ...columnQuarter,
          //         {
          //           title: "Действие",
          //           render: ({ id }: ICompanyDrugs) => {
          //             return (
          //               <EditOutlined
          //                 style={{ fontSize: "24px" }}
          //                 color="#fadb14"
          //                 onClick={showModal}
          //               />
          //             );
          //           },
          //         },
          //       ]
          // }
          dataList={planList.items || []}
          dataType={null}
          onChange={onChangePlanTable}
          isLoading={isLoading}
          data={planList}
          // setSelected={setSelected}
          current={Number(searchParams.get("page"))}
          rowSelection={false}
          height={"50vh"}
          width={2000}
        />
      </Spin>
    </>
  );
};

export default Plan;
