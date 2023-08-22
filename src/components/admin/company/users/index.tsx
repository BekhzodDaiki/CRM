import { useEffect, useState } from "react";
import { getCompanies } from "./request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ColumnsType } from "antd/lib/table";
import { IBase, ICompany } from "../../../../shared/types";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { TableProps } from "antd/es/table";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Company = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);

  const getCompanyList = async () => {
    const request = await getCompanies(
      Object.fromEntries(searchParams.entries())
    );
    
    if (request !== 'error') {
      setCompanyList(request);
    }    
    setLoading(false);
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const onChangePillTable: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/company?page=${current}&size=20`);
  };

  const columns: ColumnsType<ICompany> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Наименование",
      render: ({ name, id }) => (
        <Link to={`${id}/offers?page=1&page_size=20`}>{name}</Link>
      ),
    },
    {
      title: "Bitrix id",
      dataIndex: "bitrix_id",
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
      <h3 style={{ textAlign: "center" }}>Компании</h3>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <Button type="primary">
          <Link to="create">Создать</Link>
        </Button>
      </div>
      <RowSelectionTable
        columns={columns}
        dataList={companyList || []}
        dataType={null}
        onChange={onChangePillTable}
        isLoading={isLoading}
        data={companyList}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"50vh"}
      />
    </div>
  );
};

export default Company;
