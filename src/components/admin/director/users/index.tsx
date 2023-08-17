import { useEffect, useState } from "react";
import { getGroupOwner } from "./request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ColumnsType } from "antd/lib/table";
import { IBase, IGroupOwner, IPharmacy } from "../../../../shared/types";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { TableProps } from "antd/es/table";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const DirectorPharmacy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [directorList, setDirector] = useState([]);

  const getDirectorList = async () => {
    const request = await getGroupOwner(
      Object.fromEntries(searchParams.entries())
    );
    setDirector(request);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getDirectorList();
  }, []);

  const onChangePillTable: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/pharmacy-ceo?page=${current}&size=20`);
  };

  const columns: ColumnsType<IGroupOwner> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Username",
      // dataIndex: "username",
      render: ({ username, id }) => (
        <Link to={`${id}/drugstore-group-owners?page=1&page_size=20`}>{username}</Link>
      ),
    },
    {
      title: "Наименование",
      dataIndex: "drug_store_group",
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
      <h3 style={{ textAlign: "center" }}>Директора Аптек</h3>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <Button type="primary">
          <Link to="create">Создать</Link>
        </Button>
      </div>
      <RowSelectionTable
        columns={columns}
        dataList={directorList}
        dataType={null}
        onChange={onChangePillTable}
        isLoading={isLoading}
        data={directorList}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"50vh"}
      />
    </div>
  );
};

export default DirectorPharmacy;
