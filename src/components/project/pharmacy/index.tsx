import { useEffect, useState } from "react";
import { Input, Popconfirm, Select, Switch, Table, message } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import { IBase, ICompanyDrugStores } from "../../../shared/types";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import RowSelectionTable from "../../../shared/RowSelectionTable";
import {
  addOfferDrugStoresToOffer,
  getSingleOfferDrugStores,
  removeOfferDrugStoresFromOffer,
  searchDrugstore,
} from "../request";
import SearchFilter from "../../../shared/SearchFiler";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import CompanyProject from "..";

const Pharmacy = () => {
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [pharmacyList, setPharmacyList] = useState({
    page: 1,
    size: 20,
    total: 0,
    items: [],
  });
  const [selectedProjectId, setSelectedProjectId] = useState({
    value: 0,
    label: "",
  });
  const [options] = useState([
    {
      value: "id",
      label: "Id",
    },
    {
      value: "name",
      label: "Наименование",
    },
    {
      value: "inn",
      label: "ИНН",
    },
    {
      value: "group_id",
      label: "Груп id",
    },
    {
      value: "class",
      label: "Класс",
    },
    {
      value: "region",
      label: "Регион",
    },
    {
      value: "nas_punkt",
      label: "Наш пункт",
    },
  ]);

  const [searchKey, setSearchKey] = useState({
    key: "",
    value: "",
  });
  const [isFilterOn, setFilter] = useState(false);

  const confirm = async (arg1: string, drugStoreId: number) => {
    message.success("Click on Yes");
    setLoading(true);
    if (arg1 === "add") {
      const request = await addOfferDrugStoresToOffer(props.id, {
        offer_id: props.id,
        drugstore_id: drugStoreId,
        // "company_owner": true,
        // "is_agree": true
      });
      getList();
      message.success("Успешно привязано");
      setLoading(false);
    } else {
      const request = await removeOfferDrugStoresFromOffer(
        props.id,
        drugStoreId
      );
      message.success("Успешно отвязано");
      getList();
      setLoading(false);
    }
  };

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Click on No");
  };

  const onChangePharmacyTable: TableProps<IBase>["onChange"] = ({
    current,
  }) => {
    // navigate(`/project?page=${current}&size=20`);
    console.log("current: ", current);
    navigate({
      pathname: "/project/pharmacy",
      search: `?${createSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        page: current,
      })}`,
    });
  };

  const getList = async () => {
    let params = Object.fromEntries(searchParams.entries());
    let request;
    if (
      (Object.keys(params).length < 3 || searchParams.get("order_by")) &&
      !isFilterOn
    ) {
      request = await getSingleOfferDrugStores(selectedProjectId.value, params);
    } else {
      request = await searchDrugstore(params);
    }
    setPharmacyList(request);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedProjectId && selectedProjectId.value) {
      setLoading(true);
      getList();
    }
    // else {
    //   setPharmacyList({ items: [], page: 1 })
    //   navigate(`/project?page=1&size=20`);
    // }
  }, [searchParams, isFilterOn, selectedProjectId]);

  // useEffect(() => {
  //   if (props.tabKey === 'pharmacy') {
  //     if(!isFilterOn) {
  //       getList();
  //     }
  //   }
  // }, [isFilterOn]);
  const handleSort = (order_by: string, name: string) => {
    console.log(order_by);
    if (order_by === "ascend") {
      return navigate(`/project/pharmacy?page=1&size=20&order_by=${name}`);
    } else if (order_by === "descend") {
      return navigate(`/project/pharmacy?page=1&size=20&order_by=-${name}`);
    }
    return navigate("/project/pharmacy?page=1&size=20");
  };

  const columns: ColumnsType<ICompanyDrugStores> = [
    {
      title: "ID",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.id ? drugstore.id : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "id"),
    },
    {
      title: "Наименование",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.name ? drugstore.name : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "name"),
    },
    {
      title: "Класс",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.class_value ? drugstore.class_value : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "class_value"),
    },
    {
      title: "Груп id",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.group_id ? drugstore.group_id : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "group_id"),
    },
    {
      title: "ИНН",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.inn ? drugstore.inn : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "inn"),
    },
    {
      title: "Наш пункт",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.nas_punkt ? drugstore.nas_punkt : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "nas_punkt"),
    },
    {
      title: "Регион",
      render: ({ drugstore }: ICompanyDrugStores) =>
        drugstore && drugstore.region ? drugstore.region : "",
      sorter: (a: string, b: string, c: string) => handleSort(c, "region"),
    },
    {
      title: "Привязать/Отвязать",
      render: ({ is_agree, id }: ICompanyDrugStores) => {
        return (
          <Popconfirm
            title="Уверены отвязать аптеку?"
            // description="Уверены отвязать аптеку?"
            onConfirm={() => confirm("remove", id)}
            onCancel={() => cancel()}
            okText="Yes"
            cancelText="No"
          >
            <CloseCircleTwoTone
              style={{ fontSize: "24px" }}
              twoToneColor="#f5222d"
            />
          </Popconfirm>
        );
      },
    },
  ];

  const columnsSearch = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Наименование",
      dataIndex: "name",
    },
    {
      title: "Класс",
      render: ({ type }: any) => {
        return type;
      },
      // render: ({ type }: any) => type.name ? type.name: type,
    },
    {
      title: "Груп id",
      render: ({ group }: any) => {
        return group;
      },
      // render: ({ group }: any) => group.id ? group.id: group,
    },
    {
      title: "ИНН",
      dataIndex: "inn",
    },
    // {
    //   title: 'Наш пункт',
    //   render: ({ drugstore: { nas_punkt } }: ICompanyDrugStores) => nas_punkt,
    // },
    {
      title: "Регион",
      render: ({ region }: any) => {
        return region && region.name ? region.name : "";
      },
    },
    {
      title: "Пункт",
      render: ({ nas_punkt }: any) => {
        return nas_punkt ? nas_punkt : "";
      },
    },
    {
      title: "Привязать/Отвязать",
      render: ({ is_agree, id }: ICompanyDrugStores) => {
        // return is_agree
        //   ?
        //   <>
        //     <Popconfirm
        //       title="Уверены привязать аптеку?"
        //       // description="Уверены привязать аптеку?"
        //       onConfirm={() => confirm('add', id)}
        //       onCancel={() => cancel()}
        //       okText="Yes"
        //       cancelText="No"
        //     >
        //       <CheckCircleTwoTone
        //         style={{ fontSize: '24px' }}
        //         twoToneColor="#52c41a"
        //       />
        //     </Popconfirm>
        //   </>
        //   : <>
        //     <Popconfirm
        //       title="Уверены отвязать аптеку?"
        //       // description="Уверены отвязать аптеку?"
        //       onConfirm={() => confirm('remove', id)}
        //       onCancel={() => cancel()}
        //       okText="Yes"
        //       cancelText="No"
        //     >
        //       <CloseCircleTwoTone
        //         style={{ fontSize: '24px' }}
        //         twoToneColor="#f5222d"
        //       />
        //     </Popconfirm>
        //   </>
        return (
          <Popconfirm
            title="Уверены отвязать аптеку?"
            // description="Уверены отвязать аптеку?"
            onConfirm={() => confirm("remove", id)}
            onCancel={() => cancel()}
            okText="Yes"
            cancelText="No"
          >
            <CloseCircleTwoTone
              style={{ fontSize: "24px" }}
              twoToneColor="#f5222d"
            />
          </Popconfirm>
        );
      },
    },
  ];

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const handleFilter = (checked: boolean) => {
    setFilter(checked);
    if (!checked) {
      setSearchKey({
        key: "",
        value: "",
      });
      // navigate('/project/pharmacy?page=1&page_size=20');
    }
    if (checked) {
      setPharmacyList({
        page: 1,
        size: 20,
        total: 0,
        items: [],
      });
    }
    navigate("/project/pharmacy?page=1&page_size=20");
  };
  console.log("we are ere");
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ marginRight: 8 }}>Выберите проект: </span>
        <CompanyProject
          onChange={setSelectedProjectId}
          value={selectedProjectId}
        />
      </div>
      {selectedProjectId && selectedProjectId.value ? (
        <div className="filter-wrapper">
          <div className="filter-button">
            <span>Включить фильтр:</span>
            <Switch onChange={handleFilter} disabled={isLoading} />
          </div>
          <div>
            <Select
              style={{ minWidth: 140 }}
              placeholder={"Фильтр"}
              options={options}
              allowClear={true}
              onChange={(value) => {
                setSearchKey({
                  key: value,
                  value: "",
                });
              }}
              disabled={!isFilterOn}
              value={searchKey.key}
            />
            <Input
              style={{ width: "32vw" }}
              disabled={!isFilterOn}
              placeholder={`Введите`}
              value={searchKey.value}
              multiple={true}
              onChange={({ target: { value } }: any) => {
                setSearchKey({
                  key: searchKey.key,
                  value,
                });
                if (searchKey.key) {
                  setLoading(true);
                  if (timer) {
                    clearTimeout(timer);
                  }
                  const newTimer = setTimeout(async () => {
                    setLoading(true);
                    navigate(
                      `/project/pharmacy?${searchKey.key}=${value}&page=1&size=20`
                    );
                    // const request = await searchDrugstore({ [searchKey.key]: value })
                    // setPharmacyList(request);
                    setLoading(false);
                  }, 500);
                  // @ts-ignore
                  setTimer(newTimer);
                }
              }}
            />
          </div>
        </div>
      ) : null}
      <RowSelectionTable
        columns={isFilterOn ? columnsSearch : columns}
        dataList={pharmacyList.items || []}
        dataType={null}
        onChange={onChangePharmacyTable}
        isLoading={isLoading}
        data={pharmacyList}
        setSelected={setSelected}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"56vh"}
      />
    </div>
  );
};

export default Pharmacy;
