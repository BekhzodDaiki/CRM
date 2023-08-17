import { useEffect, useState } from "react";
import { getCategory } from "./request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import { Link } from "react-router-dom";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { ColumnsType } from "antd/lib/table";
import { IBase, IClassification, ICompany } from "../../../../shared/types";
import { EditOutlined } from "@ant-design/icons";
import { TableProps } from "antd/es/table";

const CompanySetting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    items: [],
    page: 1,
    size: 20,
    total: 0,
  });
  const [isLoading, setLoading] = useState(false);

  const getCategories = async () => {
    const request = await getCategory(
      Object.fromEntries(searchParams.entries())
    );
    console.log("req: ", request);
    setCategory(request);
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const columns: ColumnsType<IClassification> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Значение",
      dataIndex: "value",
    },
    {
      title: "Sales per day",
      dataIndex: "sales_per_day",
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

  const onChangeSettingTable: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/company/setting?page=${current}&size=20`);
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Категория Аптек</h3>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <Button type="primary">
          <Link to="create">Создать</Link>
        </Button>
      </div>
      <RowSelectionTable
        columns={columns}
        dataList={category.items}
        dataType={null}
        onChange={onChangeSettingTable}
        isLoading={isLoading}
        data={category}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"50vh"}
      />
    </div>
  );
};

export default CompanySetting;
