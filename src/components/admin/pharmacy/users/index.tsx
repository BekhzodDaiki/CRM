import { useEffect, useState } from "react";
import { getPharmacies } from "./request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ColumnsType } from "antd/lib/table";
import { IBase, ICompany, IPharmacy } from "../../../../shared/types";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { TableProps } from "antd/es/table";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Pharmacy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [pharmacyList, setPharmacyList] = useState([]);

  const getPharmacyList = async () => {
    const request = await getPharmacies(
      Object.fromEntries(searchParams.entries())
    );
    if (request !== "error") {
      setPharmacyList(request);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getPharmacyList();
  }, []);

  const onChangePillTable: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/admin-pharmacy/user?page=${current}&size=20`);
  };

  const columns: ColumnsType<IPharmacy> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Username",
      // dataIndex: "username",
      render: ({ username, id }) => (
        <Link to={`${id}/pharmacy?page=1&page_size=20`}>{username}</Link>
      ),
    },
    {
      title: "Наименование",
      dataIndex: "drug_store",
      render: ({ name }: IBase) => name,
    },
    {
      title: "Действие",
      render: ({ id }) => (
        <Link className="link-style" to={`${id}/edit`}>
          <EditOutlined style={{ fontSize: "24px" }} />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Аптеки</h3>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <Button type="primary">
          <Link to="create">Создать</Link>
        </Button>
      </div>
      <RowSelectionTable
        columns={columns}
        dataList={pharmacyList}
        dataType={null}
        onChange={onChangePillTable}
        isLoading={isLoading}
        data={pharmacyList}
        // setSelected={setSelected}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"50vh"}
      />
    </div>
  );
};

export default Pharmacy;
