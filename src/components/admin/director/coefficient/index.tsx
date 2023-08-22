import { useEffect, useState } from "react";
import { getCoefficientList } from "./request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import { Link } from "react-router-dom";
import RowSelectionTable from "../../../../shared/RowSelectionTable";
import { ColumnsType } from "antd/lib/table";
import { IBase, IClassification, ICompany } from "../../../../shared/types";
import { EditOutlined } from "@ant-design/icons";
import { TableProps } from "antd/es/table";

const Coefficient = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [coefficient, setCoefficient] = useState({
    items: [],
    page: 1,
    size: 20,
    total: 0,
  });
  const [isLoading, setLoading] = useState(false);

  const getCoefficients = async () => {
    const request = await getCoefficientList(
      Object.fromEntries(searchParams.entries())
    );
    if (request !== 'error') {
       setCoefficient(request);
    }
   
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getCoefficients();
  }, []);

  const columns: ColumnsType<IClassification> = [
    {
      title: "ID",
      dataIndex: "id",
      fixed: "left",
      width: 91
    },
    {
      title: "Лекарство",
      dataIndex: "drug",
      render: ({ name }) => name,
      // width: 200,
      fixed: "left",
    },
    {
      title: 'Январь',
      dataIndex: 'january'
    },
    {
      title: 'Февраль',
      dataIndex: 'february'
    },
    {
      title: 'Март',
      dataIndex: 'march'
    },
    {
      title: 'Апрель',
      dataIndex: 'april'
    },
    {
      title: 'Май',
      dataIndex: 'may'
    },
    {
      title: 'Июнь',
      dataIndex: 'june'
    },
    {
      title: 'Июль',
      dataIndex: 'july'
    },
    {
      title: 'Август',
      dataIndex: 'august'
    },
    {
      title: 'Сентябрь',
      dataIndex: 'september'
    },
    {
      title: 'Октябрь',
      dataIndex: 'october'
    },
    {
      title: 'Ноябрь',
      dataIndex: 'november'
    },
    {
      title: 'Декабрь',
      dataIndex: 'december'
    },
    {
      title: "Действие",
      fixed: 'right',
      render: ({ id }) => (
        <Link className="link-style" to={`${id}`}>
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
      <h3 style={{ textAlign: "center" }}>Коэффициент</h3>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <Button type="primary">
          <Link to="create">Создать</Link>
        </Button>
      </div>
      <RowSelectionTable
        columns={columns}
        dataList={coefficient.items}
        dataType={null}
        onChange={onChangeSettingTable}
        isLoading={isLoading}
        data={coefficient}
        current={Number(searchParams.get("page"))}
        rowSelection={false}
        height={"50vh"}
        width={2000}
      />
    </div>
  );
};

export default Coefficient;
