import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getDrugStores } from "./request";
import { ColumnsType } from "antd/lib/table";
import { TableProps } from "antd/es/table";
import { IAdminPharmacy, IBase, ISingleCompanyOffers } from "../../../../shared/types";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Single = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [drugstore, setDrugstores] = useState({
    page: 1,
    size: 20,
    total: 0,
    items: [],
  });
  const navigate = useNavigate();

  const fetchDrugstores = async () => {
    const request = await getDrugStores({
      id,
      ...Object.fromEntries(searchParams.entries()),
    });
    setDrugstores(request);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchDrugstores();
  }, []);

  const onChangeDrugstore: TableProps<IBase>["onChange"] = ({ current }) => {
    navigate(`/admin-pharmacy?page=${current}&page_size=20`);
  };

  const columns: ColumnsType<IAdminPharmacy> = [
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
    {
      title: "ИНН",
      dataIndex: "inn",
    },
    {
      title: "Пункт",
      dataIndex: "nas_punkt",
    },
    {
      title: "Груп",
      dataIndex: "group",
      render: ({ name }) => name,
    },
    {
      title: "Регион",
      dataIndex: "region",
      render: ({ name }) => name,
    },
    {
      title: "Геолокация",
      render: ({ lat, long }) => <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${long}`}
        target="_blank"
      >
        Google Map
      </a>,
      // render: ({ lat, long }) => <span>{`${lat}-${long}`}</span>,
    },
    {
      title: "Тип",
      dataIndex: "type",
    },
  ];

  return (
    <div>
      <h3 style={{ textAlign: 'center' }} >Аптеки</h3>
      <RowSelectionTable
        columns={columns}
        dataList={drugstore.items}
        dataType={null}
        onChange={onChangeDrugstore}
        isLoading={isLoading}
        data={drugstore}
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
          <Link to="/admin-pharmacy?page=1&page_size=20">Назад</Link>
        </Button>
      </div>
    </div>
  );
};

export default Single;
