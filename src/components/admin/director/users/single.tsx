import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getDirectorDrugstores } from "./request";
import { ColumnsType } from "antd/lib/table";
import { TableProps } from "antd/es/table";
import { IBase, ISingleCompanyOffers } from "../../../../shared/types";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Single = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [company, setDrugstores] = useState({
    page: 1,
    size: 20,
    total: 0,
    items: [],
  });
  const navigate = useNavigate();

  const fetchDirectorDrugstores = async () => {
    const request = await getDirectorDrugstores(
      Number(id),
      Object.fromEntries(searchParams.entries())
    );
    if (request !== "error") {
      setDrugstores(request);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchDirectorDrugstores();
  }, []);

  const onChangeDrugstoreTable: TableProps<IBase>["onChange"] = ({
    current,
  }) => {
    navigate(`/company?page=${current}&page_size=20`);
  };

  const columns: ColumnsType<ISingleCompanyOffers> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Наименование",
      dataIndex: "name",
    },
    {
      title: "Адрес",
      dataIndex: "address",
    },
  ];

  return (
    <div>
      <RowSelectionTable
        columns={columns}
        dataList={company.items}
        dataType={null}
        onChange={onChangeDrugstoreTable}
        isLoading={isLoading}
        data={company}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"50vh"}
      />
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button type="dashed">
          <Link to="/pharmacy-ceo/user?page=1&page_size=20">Назад</Link>
        </Button>
      </div>
    </div>
  );
};

export default Single;
